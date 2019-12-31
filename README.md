# Github-Graphs

Website for visualizing a persons github network.

![Example Graph](./doc/graphExample.png)

If you are lucky, you can find the site live [here](https://github-graphs.com/);

# Built With

- [BootStrap](https://getbootstrap.com/)
- [jQuery](https://jquery.com/)
- [Vis JS](http://visjs.org/)
- [Github v3 API](https://developer.github.com/v3/)
- [Node.js](https://nodejs.org/en/)

![javascript](./doc/javaScript.jpg)

# Running

Create a .env file with the code below filled in.

```
CLIENT_ID = <your_github_username>
CLIENT_SECRET = <your_generated_personal_access>
SESSION_SECRET = <any_string_you_want>
PORT = <any_number>
```

```bash
npm install
```

```bash
node server.js
```

# Contributing

We are very open to new contributors. If you want to contribute to this project, and don't know where to start, look at the [open issues](https://github.com/jrtechs/github-graphs/issues). Once you know what you want to work on, comment on the issue and file a pull request.

# API Reference

`GET https://github-graphs.com/api/friends/<username>`

Fetches `https://api.github.com/users/<username>/followers` [(GitHub Reference)](https://developer.github.com/v3/users/followers/#list-followers-of-a-user) and `https://api.github.com/users/<username>/following` [(GitHub Reference)](https://developer.github.com/v3/users/followers/#list-users-followed-by-another-user) to generate an array of users following `<username>` and that `<username>` follows each with values `login` and `avatar_url`.

Example result:

```json
[
  {
    "login": "jrtechs",
    "avatar_url": "https://avatars1.githubusercontent.com/u/13894625?s=460&v=4"
  }
]
```

---

`GET https://github-graphs.com/api/repositories/<username>`

Fetches `https://api.github.com/users/<username>/repos` and returns an array of the repositories `<username>` owns.

Example result:

```json
[
  {
    "name": "bash_manager",
    "created_at": "2017-09-27T14:38:01Z",
    "homepage": "",
    "description": "Python scripts I use to manage my ssh connections, drive mounts, and other bash related things. ",
    "language": "Python",
    "forks": 26,
    "watchers": 4,
    "open_issues_count": 7,
    "license": {
      "key": "mpl-2.0",
      "name": "Mozilla Public License 2.0",
      "spdx_id": "MPL-2.0",
      "url": "https://api.github.com/licenses/mpl-2.0",
      "node_id": "MDc6TGljZW5zZTE0"
    },
    "html_url": "https://github.com/jrtechs/bash_manager"
  }
]
```

---

`GET https://github-graphs.com/api/org/users/<organization_name>`

Fetches `https://api.github.com/orgs/<organization_name>/members` [(GitHub Reference)](https://developer.github.com/v3/orgs/members/#members-list) to generate an array of users that are in `<organization_name>` each with values `login` and `avatar_url`.

Example result:

```json
[
  {
    "login": "jrtechs",
    "avatar_url": "https://avatars1.githubusercontent.com/u/13894625?s=460&v=4"
  }
]
```

---

`GET https://github-graphs.com/api/org/repositories/<organization_name>`

Fetches `https://api.github.com/orgs/<organization_name>/repos` [(GitHub Reference)](https://developer.github.com/v3/repos/#list-organization-repositories) to return an array of repositories `<organization_name>` owns.

Example result:

```json
[
  {
    "name": "vue",
    "created_at": "2013-07-29T03:24:51Z",
    "homepage": "http://vuejs.org",
    "description": "🖖 Vue.js is a progressive, incrementally-adoptable JavaScript framework for building UI on the web.",
    "language": "JavaScript",
    "forks": 23228,
    "watchers": 154891,
    "open_issues_count": 419,
    "license": {
      "key": "mit",
      "name": "MIT License",
      "spdx_id": "MIT",
      "url": "https://api.github.com/licenses/mit",
      "node_id": "MDc6TGljZW5zZTEz"
    },
    "html_url": "https://github.com/vuejs/vue"
  }
]
```
