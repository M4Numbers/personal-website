from setuptools import setup

setup(
    name='Walkers',
    version='0.1',
    description='A collection of web crawlers attuned to specific APIs',
    author='Matthew Ball',
    author_email='m.477h3w@live.co.uk',
    packages=['walkers'],
    requires=['requests', 'xmltodict', 'imgurpython', 'oauth2client', 'tweepy'],
    license='Apache2'
)
