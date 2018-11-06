# Umber
<<<<<<< HEAD
  Application for selling items.
  

## API 
  API REST with **Symfony@3.4.18**
 
__**Required**__
<ul>
  <li>
    composer
  </li>
  <li>
    php >= 5.6
  </li>
  </ul>
  
 __**Setup**__ 
 
      $ git clone [repo]
      $ cd [repo-cloned]
      $ composer install 

**Settings Project** ( parameters.yml )

    database_host: 127.0.0.1
    database_port: default for windows (8889 for macos / linux)
    database_name: symfony (default)
    database_user: root
    database_password: null (root linux / macos)
    mailer_transport: smtp
    mailer_host: 127.0.0.1
    mailer_user: [your email]
    mailer_password: [your email_password]
    secret: ThisTokenIsNotSoSecretChangeIt

 __**Run**__ 
 
      $ php bin/console doctrine:database:create ( if not exist )
      $ php bin/console assets:install
      $ php bin/console doctrine:schema:update --force ( check your entities version / sync your current DB )
      $ php bin/console doctrine:generate:entities ( check your entities version / sync entities methods )
      $ php bin/console server:run (http://127.0.0.1:8000/ default)
      
      
=======

=============



[![ForTheBadge built-with-love](http://ForTheBadge.com/images/badges/built-with-love.svg)](https://github.com/sylvainSUPINTERNET)
>>>>>>> aca22908acafdbba386074c6403a8ecb10d336d4
