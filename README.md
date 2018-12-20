## Installing the application

1. Clone this GIT repository to your local environment
2. Create a MySQL database (select utf8mb4_general_ci or similar as collation)
3. Populate the database using the scripts in the resources/sql folder
4. Copy the .env-example file to .env, and fill in your database connection details
5. Install the Composer dependencies:

	`composer install`
	
## Running the application

Because of the Slim framework this application cannot run within a subfolder of your localhost.
The easiest way to get the application running, is to use the PHP internal webserver from the command-line.

Go to a terminal / command-prompt and go to the root directory of this project.
Then type the following command:

`php -S localhost:8080 -t src/public`

This should result in something like the following:

```
PHP 7.2.12 Development Server started at Fri Nov 23 14:45:26 2018
Listening on http://localhost:8080
Document root is /home/user/www/php-exam/src/public
Press Ctrl-C to quit.
```

Now enter the following URL in your browser:

`http://localhost:8080`

If the application is installed properly, you should now see the first screen of the Event Management System.

If for some reason you wish to run the application through Apache or Nginx, follow the instructions here:

https://www.slimframework.com/docs/v3/start/web-servers.html
