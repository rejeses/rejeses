# REJESES CONSULTING

Learn and become excellent at project management.

## Getting started with the development server

RUN:
```bash
- git clone https://github.com/therealghostdev/rejeses.git

#Go into project directory after cloning as seen in root folder.
#Example: cd rejeses (Assumining this is how the file was named in cloning directory)

- npm or yarn install

- npm run dev / yarn dev #(To start development server)
```

For backend dev environment setup:

Ensure development server is down if running and you have docker installed

then run:

```bash
- docker-compose up -d

- npx prisma migrate dev --name sample_name #(name should match latest prisma migration as seen in prisma migrations folder in project directory)

- npx prisma db seed #(if this command runs successfully without errors, start the development server again as described earlier)  
```
If you experience any issue setting up any of the dev environment, please contact the project maintainer/owner
GRACIAS🪄