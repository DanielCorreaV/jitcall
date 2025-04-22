
#  JITCALL APP

## INDICE
1. [Introducción](#introducción)
2. [Características](#características)
3. [Instalación](#instalación)
4. [Uso](#uso)
6. [Tecnologías Usadas](#tecnologías-usadas)
7. [Firebase-firestore](#firebase-firestore)
8. [Autor](#autor)


---

##  Introducción
Jitcall es una aplicacion mobile que ocupa firebase (firestore) para almacenar sus datos en la nube y en tiempo real, solo se necesita una cuenta para poder empezar a guardar contactos y realizar videollamadas desde cualquier lugar.

##  Características
-  Crear Cuenta
-  Registrar contactos
-  Editar contactos
-  Eliminar contactos
-  Interactividad con el usuario.

##  Instalación

###  **Requisitos Previos**
- **Node.js** (última versión recomendada)
- **Ionic CLI** (instalar con `npm install -g @ionic/cli`)
- **Angular CLI** (instalar con `npm install -g @angular/cli`)

NOTA: se requiere versiones de Angular/ionic 17 o superior

### ⚙️ **Pasos de Instalación**
1. Clona este repositorio:  
   ```sh
   git clone [https://github.com/DanielCorreaV/crudwithfirebase.git](https://github.com/DanielCorreaV/jitcall.git)
   ```
2. Entra al directorio del proyecto:  
   ```sh
   cd jitcall
   ```
3. Instala las dependencias:  
   ```sh
   npm install 
   ```
    ```sh
   npm install -g @ionic/cli
   ```
      ```sh
   npm install -g @angular/cli
   ```
5. Ejecuta la aplicación en modo desarrollo:  
   ```sh
   ionic serve
   ```

## Uso
Pagina de login: 
![image](https://github.com/user-attachments/assets/0aebbf75-82f5-4b49-95e0-ee56d893bade)


Pagina de registro: 
![image](https://github.com/user-attachments/assets/45b2b2da-b7f7-4100-aa62-6d345f354437)


# Pagina principal: 
pagina de contactos:
![image](https://github.com/user-attachments/assets/cd6ba3bc-8fd4-41be-959b-4461bee8ba85)


pagina de registro de usuarios:
![image](https://github.com/user-attachments/assets/7ed3b704-5e85-4ba9-9c6e-24a5048ebeac)


pagina de perfil:
![image](https://github.com/user-attachments/assets/1993503e-291d-40e6-bc36-fcae3bb31dd2)


pagina de vista de contacto:
![image](https://github.com/user-attachments/assets/83081d9e-bf94-4782-bd70-214377cc5a4d)






## Tecnologías Usadas
- **Ionic** (Framework para aplicaciones híbridas)
- **Angular** (Framework frontend)
- **TypeScript** (Superconjunto de JavaScript)
- **FireBase/FireStore** (https://firebase.google.com/docs/firestore?hl=es-419)

## Firebase-firestore

La configuraciòn de firebase se realiza mediante el uso del coremodule, este ocupa de las credenciales alojadas en enviroments para dar acceso, estas credenciales se hacen referencia dentro de los providers del core module a travez de los metodos: 

- initializeApp y provideFirebaseApp de @angular/fire/app.
- provideFirestore y getFirestore de @angular/fire/firestore.

finalmente estas configuraciones se dirigen al app module a travez del importe del core module entre sus importes.

## Autor
- **Nombre**: [Daniel Correa Vega](https://github.com/DanielCorreaV)
- **Correo**: correavegadaniel@gmail.com
