#Overview

This is the source code used for my presentation at the [AngularJS Portland Meetup](http://www.meetup.com/AngularJS-Portland/events/212441852/) where I gave a talk on implementing RESTful services using a factory fronted by cache using AngularJS.

#Prerequisites

- [git](http://git-scm.com/)
- [nodejs](http://nodejs.org/)
- [bower](http://bower.io/)
- [grunt](http://gruntjs.com/)
- [MySQL](http://www.mysql.com/)
- [Apache](http://httpd.apache.org/)

_**Note:** Because this demo utilizes ajax requests, you need to have apache running in front of the site for it to be served up from localhost. A simple VirtualHost entry in your apache configs will set you up._


#Installation

##Download and Install Dependencies

```
$ git clone https://github.com/JPodz/presentations.git
$ npm install
$ bower install
$ grunt
```

##Create MySQL Schema
You can connect to MySQL via a GUI like [Sequal Pro](http://www.sequelpro.com/) or [MySQL Workbench](http://dev.mysql.com/downloads/workbench/), or you can do it from the command line.

```
$ mysql --user=user_name --password=your_password db_name
```

After you've connected, run the following query.

```
CREATE DATABASE `Demo`;
USE `Demo`;
CREATE TABLE `bands` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `bestAlbum` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=latin1;
```

##Start API Server

```
$ cd /path/to/presentations/angularjs-rest/api
$ node index.js
```
