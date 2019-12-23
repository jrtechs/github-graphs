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