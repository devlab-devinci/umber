# Umber
<strong>Hybrid mobile application to relate customers and consumers.</strong>


<ul>
<li>Hybrid Mobile application</li>
<li>API</li>
</ul>


##For use vm
### Prequest install VM
 > - VirtualBox (https://www.virtualbox.org/wiki/Downloads)
 > - Vagrant (https://www.vagrantup.com/downloads.html)
### Vagrant

``` bash
# share file with hote and vm
vagrant plugin install vagrant-vbguest

# update vagrantfile the virtual machine
vagrant up

# up the virtual machine
vagrant provision

# connect to machine
vagrant ssh
## create link symbolic
sudo ln -s /opt/VBoxGuestAdditions-4.3.10/lib/VBoxGuestAdditions /usr/lib/VBoxGuestAdditions

# modif password vagrant
passwd vagrant
```
### Android

> - https://developer.android.com/studio/
> - https://docs.nativescript.org/start/ns-setup-linux


### API
nodemon bin/www.js

forward : 
ssh -R 80:localhost:3000 serveo.net

(don't forget to update ./application/api_config.js with forewarded url);

### Payment Server

nodemon bin/www

forward : 
ssh -R 80:localhost:6999 serveo.net

(don't forget to update ./application/api_config.js with forewarded url);






        nodemon bin/www
