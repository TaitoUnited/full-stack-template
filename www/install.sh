#!/bin/bash

set -xe

apt-get -y update
cd /tmp

#-------------------------------------------------------------------------
# Install Hugo. NOTE: You may remove this if you do not use Hugo.
#-------------------------------------------------------------------------

HUGO_VERSION=0.54.0
wget https://github.com/gohugoio/hugo/releases/download/v${HUGO_VERSION}/hugo_extended_${HUGO_VERSION}_Linux-64bit.deb
apt install /tmp/hugo_extended_${HUGO_VERSION}_Linux-64bit.deb
rm -f /tmp/hugo_extended_${HUGO_VERSION}_Linux-64bit.deb

echo 'Hugo installed'

#-------------------------------------------------------------------------
# Install Jekyll. NOTE: You may remove all this if you do not use Jekyll
#-------------------------------------------------------------------------

apt-get -y install ruby-full build-essential
echo '# Install Ruby Gems to ~/gems' >> ~/.bashrc
echo 'export GEM_HOME="$HOME/gems"' >> ~/.bashrc
echo 'export PATH="$HOME/gems/bin:$PATH"' >> ~/.bashrc
. ~/.bashrc
gem install jekyll bundler

echo 'Jekyll installed'
