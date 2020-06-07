# IBM Chatbot

Este proyecto requiere tener NodeJS instalado, así como npm.




### Instalación
Primero hay que clonar el repositorio a una carpeta local dentro de la computadora, una vez clonado hay que entrar a la carpeta y correr el comando `npm install` el cual instalará todas las dependencias necesarias para correr el proyecto.


### Herramientas utilizadas
- NodeJS
- PostgreSQL
- IBM Watson Discovery
- IBM Watson Assistant

### Para utilizarlo correctamente.
Para utilizar correctamente el proyecto primero se tiene que crear una base de datos en PostgreSQL y sustituir los datos del Pool a los datos de la nueva base de datos creada.

Después de esto hay que crear un archivo .env que tenga el siguiente formato

```
// .env (do not forgot to add this to your .gitignore)`
WATSON_WORKSPACE_ID=workspace-id
WATSON_VERSION=2018-04-15
WATSON_URL=https://gateway.watsonplatform.net/assistant/api
WATSON_USERNAME=username
WATSON_PASSWORD=password
ASSISTANT_ID=YOURASSISTANTIDGOESHERE
API_KEY=YOURAPIKEYGOESHERE
```
El .env va en la carpeta raíz.

Se requiere el assistant_id y el api_key, el cual puede ser encontrado en la parte de Settings del asistente.
En el reporte final se incluye un video explicando como extraer dicha información.

Una vez que se tengan ambas llaves, y la base de datos estamos listos para correr el proyecto.

### Correr el proyecto
Se utiliza el comando `npm start` para correr el proyecto, tardará unos segundos pero cuando esté corriendo podrá recibir peticiones HTTP.

