# OpenAHP
Open source AHP  platform

**Requisitos**:
 - Docker 18.09
 - Docker-compose 1.23.1

**Ejecutar local:**
```
#in root folder execute 
>docker-compose build
>docker-compose up 
```
**Publicar plataforma:**

 1. Cambiar la dirección ip (o url) de la maquina en los siguientes archivos 

	```
	##/nodeServer/server/lib/config.js
	const MACHINE_URL = 'http://{machineIP}'
	```
	```
	##/nodeServer/client/src/config.js
	const MACHINE_URL = 'http://{machineIP}'
	```
2. Ejecutar
	
		#in root folder execute 
	    >docker-compose build
	    >docker-compose up 
3. (Opcional)

- Si se incluye un nombre de dominio se debe modificar el archivo

		/nginx/conf.d/app.conf
- Si se desea habilitar el control de usuarios por medio de google, se deben cambiar el client_id y client_secret en los archivos
		
		/nodeServer/client/src/config.js
		/nodeServer/server/lib/config.js
