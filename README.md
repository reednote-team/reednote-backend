# reednote-backend

Backend part of the reednote project, powered by strapi

The project is mastered and led by: [KevynTang](https://github.com/KevynTang)

## About the project

The Reednote project is an online note app project, **demo**: [ReedNote](https://reednote.kevyn.cn/)

- Front end repo: [reednote-frontend](https://github.com/reednote-team/reednote-frontend)
- Back end repo: [reednote-backend](https://github.com/reednote-team/reednote-backend)

Now it has had the following features:

- register / login
- create, upload, update, fetch or delete their notes
- notes create from open local files
- edit note in a WYSIWYG way
- table of contents
- good responsive design to allow high usability on both PC and mobile devices.
- note set (early stage)

current TODO list:

- finish the note set system
- images upload with static files server
- multiple authors
- improve editor UX

The project mainly powered by the following techniques, frameworks or libs:

- [Milkdown](https://github.com/Saul-Mirone/milkdown)
- [Strapi](https://strapi.io/)
- [Tailwind](https://tailwindcss.com/)
- [Vue.js](https://v3.vuejs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vitejs.dev/)

## Install a instance

For the back-end part, `yarn` is used to manage packages.

clone this repo, go into the directory, then run:

```bash
yarn
```

When finished, remember to change the server configuration in `config/server.js`:

```typescript
module.exports = ({ env }) => ({
  host: env('HOST', '0.0.0.0'),
  port: env.int('PORT', 1779),
});
```

run in development mode or build a production version with:

```bash
yarn develop
yarn run build
```

