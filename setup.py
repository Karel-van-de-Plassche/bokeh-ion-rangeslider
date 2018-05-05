"""Packaging settings."""
from codecs import open
from os.path import abspath, dirname, join
from subprocess import call

from setuptools import Command, find_packages, setup
from

this_dir = abspath(dirname(__file__))
with open(join(this_dir, 'README.md'), encoding='utf-8') as file:
    long_description = file.read()

class RunTests(Command):
    """Run all tests."""
    description = 'run tests'
    user_options = []

    def initialize_options(self):
        pass

    def finalize_options(self):
        pass

    def run(self):
        """Run all tests!"""
        errno = call(['py.test', '--cov=qualikiz_tools', '--cov-report=term-missing',
                      '--ignore=lib/'])
        raise SystemExit(errno)

setup(
    name = 'bokeh-ion-rangeslider',
    version = '0.0.1',
    description = 'Python + Typescript implementation of Ion.Rangeslider.',
    long_description = long_description,
    url = 'git@github.com:Karel-van-de-Plassche/types-ion-rangeslider.git'
    author = 'Karel van de Plassche',
    author_email = 'karelvandeplassche@gmail.com',
    license = 'MIT',
    classifiers = [
        'Intended Audience :: Developers',
        'Topic :: Utilities',
        'License :: MIT',
        'Natural Language :: English',
        'Operating System :: OS Independent',
        'Programming Language :: Python :: 3.6',
        'Programming Language :: JavaScript',
        'Topic :: Scientific/Engineering'
    ],
    packages = find_packages(exclude=['bokeh-ion-rangesliderjs', 'docs', 'tests*']),
    python_requires='~=3.6.5',
    install_requires = ['bokeh'],
    extras_require = {
        'test': ['coverage', 'pytest', 'pytest-cov'],
    },
    cmdclass = {'test': RunTests},
)
