# encoding: utf-8

import os

from tempfile import TemporaryDirectory

from fabric.api import lcd
from fabric.api import local
from fabric.api import task
from fabric.contrib.project import rsync_project


@task
def deploy():
    with TemporaryDirectory() as tmpdir:
        rsync_cmd = [
            'rsync',
            '-av',
            os.getcwd() + '/',
            tmpdir,
            '--exclude=.git*',
            '--exclude=node_modules',
            '--exclude=__pycache_',
            '--exclude=.DS_Store'
        ]
        local(' '.join(rsync_cmd))

        with lcd(tmpdir):
            local('yarn install --prefer-offline --prod')
            local('mayoiga pull -silent')

        rsync_project(
            local_dir=tmpdir + '/',
            remote_dir='/home/pi/home-monitoring',
            delete=True
        )

