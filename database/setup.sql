/*
 Este script es el que se ha ejecutado para iniciar el usuario
 y la base de datos.

 La contraseña del usuario root de mysql es 'Redes_mysql_10'

 En VirtualBox hay que crear una red 'hostonly' y asignarle
 al anfitrión la IP '192.168.56.1', también sirve si se hace
 un ALTER USER.
 
 Dentro de la maquina fedora-mysql está instalado mysql workbench
 para tener una interfaz gráfica.

 También se puede descargar en el anfitrión.
 */

CREATE DATABASE IF NOT EXISTS ps_project;

CREATE USER IF NOT EXISTS
'node_server'@'192.168.56.1'
IDENTIFIED BY 'PsProject_1234';

GRANT ALL PRIVILEGES ON ps_project.* 
TO 'node_server'@'192.168.56.1';

FLUSH PRIVILEGES;
