# -*- mode: ruby -*-
# vi: set ft=ruby :

# All Vagrant configuration is done below. The "2" in Vagrant.configure
# configures the configuration version (we support older styles for
# backwards compatibility). Please don't change it unless you know what
# you're doing.
Vagrant.configure("2") do |config|
  # The most common configuration options are documented and commented below.
  # For a complete reference, please see the online documentation at
  # https://docs.vagrantup.com.

  # Every Vagrant development environment requires a box. You can search for
  # boxes at https://vagrantcloud.com/search.
  #  config.vm.box = "debian/jessie64"
  #  config.vm.box      = "generic/debian9"
  config.vm.box = "puppetlabs/debian-8.2-64-puppet"
  # config.vm.ox = trusty64
  # Disable automatic box update checking. If you disable this, then
  # boxes will only be checked for updates when the user runs
  # `vagrant box outdated`. This is not recommended.
  # config.vm.box_check_update = false

  # Create a forwarded port mapping which allows access to a specific port
  # within the machine from a port on the host machine. In the example below,
  # accessing "localhost:8080" will access port 80 on the guest machine.
  # NOTE: This will enable public access to the opened port
  #config.vm.network "forwarded_port", guest: 80, host: 8080

  # Create a forwarded port mapping which allows access to a specific port
  # within the machine from a port on the host machine and only allow access
  # via 127.0.0.1 to disable public access
  config.vm.network "forwarded_port", guest: 8082, host: 8082, host_ip: "127.0.0.1"

  # Create a private network, which allows host-only access to the machine
  # using a specific IP.
  # config.vm.network "private_network", ip: "192.168.33.10"

  # Create a public network, which generally matched to bridged network.
  # Bridged networks make the machine appear as another physical device on
  # your network.
  # config.vm.network "public_network"

  # Share an additional folder to the guest VM. The first argument is
  # the path on the host to the actual folder. The second argument is
  # the path on the guest to mount the folder. And the optional third
  # argument is a set of non-required options.
  config.vm.synced_folder "./", "/var/www", create: true

  # Provider-specific configuration so you can fine-tune various
  # backing providers for Vagrant. These expose provider-specific options.
  # Example for VirtualBox:
  #
  config.vm.provider "virtualbox" do |vb|
  #   # Display the VirtualBox GUI when booting the machine
    vb.gui = true
  #
  #   # Customize the amount of memory on the VM:
  #   vb.memory = "1024"
  end
  #
  # View the documentation for the provider you are using for more
  # information on available options.

  # Enable provisioning with a shell script. Additional provisioners such as
  # Puppet, Chef, Ansible, Salt, and Docker are also available. Please see the
  # documentation for more information about their specific syntax and uuse.
  config.vm.provision "shell", inline: <<-SHELL
   sudo su
   apt-get update
   apt-get upgrade -y

   echo "############################################################################################"
   echo "Install gnome-desktop"
   apt-get install -y task-gnome-desktop
   add-apt-repository ppa:webupd8team/java
   add-apt-repository "deb http://ppa.launchpad.net/webupd8team/java/ubuntu xenial main"

   echo "############################################################################################"
   echo "apt update upgrade autoremove"
   apt-get update
   apt-get upgrade -y
   apt-get autoremove -y


   echo "############################################################################################"
   echo "Adding package Node and Npm"
   apt-get install -y build-essential libssl-dev npm

   # npm cache clean -f
   cd /home
   curl -sL https://raw.githubusercontent.com/creationix/nvm/v0.33.8/install.sh -o install_nvm.sh
   bash install_nvm.sh
   nvm install 9.7.1
   nvm use 9
   npm install -g npm@6.1.0
   npm install nativescript -g --unsafe-perm
   npm install -g @vue/cli @vue/cli-init

   echo "Start the installation of android tools"
   echo "Updating system..."

   echo "############################################################################################"
   echo "Adding package Java"

   dpkg --add-architecture i386
   apt-get install -y lib32z1 lib32ncurses5 libstdc++6:i386 g++


   echo "############################################################################################"
   echo "Install Java SDK 8"

   sudo apt-get install -y python-software-properties software-properties-common oracle-java8-installer
   export JAVA_HOME=$(update-alternatives --query javac | sed -n -e 's/Best: *\(.*\)\/bin\/javac/\1/p')


   echo "############################################################################################"
   echo "Download Android SDK"
   ANDROID_SDK_FILENAME=sdk-tools-linux-4333796.zip
   ANDROID_SDK=http://dl.google.com/android/repository/$ANDROID_SDK_FILENAME
   curl -O $ANDROID_SDK
   unzip $ANDROID_SDK_FILENAME
   mkdir android-sdk-linux
   mv tools android-sdk-linux
   chown -R vagrant android-sdk-linux/
   rm $ANDROID_SDK_FILENAME

   echo "ANDROID_HOME=~/android-sdk-linux" >> /home/vagrant/.bashrc
   echo "PATH=\$PATH:~/android-sdk-linux/tools:~/android-sdk-linux/platform-tools" >> /home/vagrant/.bashrc
   sudo -H gedit admin:///etc/environment


   echo "############################################################################################"
   echo "Add Emulator Android"

   $ANDROID_HOME/tools/bin/sdkmanager "tools" "emulator" "platform-tools" "platforms;android-28" "build-tools;28.0.3" "extras;android;m2repository" "extras;google;m2repository"
   cd $ANDROID_HOME/tools/bin
   ./sdkmanager "system-images;android-25;google_apis;x86"
   ./sdkmanager --licenses
   # android-sdk-linux/tools/bin/ create avd -n name -k "sdk_id" [-c {path|size}] [-f] [-p path]
   # android-sdk-linux/tools/bin/ create avd -n test -k "system-images;android-25;google_apis;x86"
   # android-sdk-linux/tools/bin/ list
   android create avd -n name -k "sdk_id" [-c {path|size}] [-f] [-p path]
   android create avd -n test -k "system-images;android-25;google_apis;x86"
   android-sdk-linux/tools/bin/ list


  echo "############################################################################################"
  echo "Adding package Node and Npm"
  cd /var/www
  npm install
  SHELL
end
