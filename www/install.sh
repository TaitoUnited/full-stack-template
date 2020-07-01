#!/bin/sh

set -xe
cd /tmp
echo > ~/.bashrc

apt-get -y update
apt-get -y install build-essential libpng-dev wget git
