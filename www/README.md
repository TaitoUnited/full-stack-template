## Configuration

Configure static site generator of your choice with the following instructions. Currently instructions are provided only for Gatsby, Hugo, Jekyll and plain static files, but with some extra work the website-template may easily be used with any static site generator.

Remove static site generators that you do not use from `www/install.sh` but do not delete the whole file:

    EDIT www/install.sh

Build and start containers (see `taito trouble` if containers fail to start):

    taito stop
    taito start --clean

Once you see text `No site yet at www/site. Just keep the container running.`, execute the following steps depending on the static site generator of your choice.

### Plain static files (no site generator)

1. Add your static files to www/public with your code editor.

2. Restart containers and open the site on browser:

    ```
    taito stop
    taito start --clean
    taito open www
    ```

### Gatsby

1. Start a shell inside the www Docker container:

    ```
    taito shell:www
    ```

2. Create a new Gatsby site based on one of the [starters](https://www.gatsbyjs.org/starters?v=2) (NOTE: Select 'npm' as package manager and ignore the 'git commit' error):

    ```
    su node
    npx gatsby new site STARTER-SOURCE-URL-OF-MY-CHOICE
    rm -rf site/.git
    exit
    exit
    ```

3. OPTIONAL: Change the development start command in `develop.sh`, if the starter uses some other command than `npm run develop -- --host 0.0.0.0 --port 8080`.

4. Enable `/service/site/node_modules` mount in `docker-compose.yaml`:

    ```
    EDIT docker-compose.yaml
    ```

5. Restart containers and open the site on browser:

    ```
    taito stop
    taito start --clean
    taito open www
    ```

### Hugo

1. Start a shell inside the www Docker container:

    ```
    taito shell:www
    ```

2. Create a new Hugo site (See [Hugo themes](https://themes.gohugo.io/) and [Hugo quick start](https://gohugo.io/getting-started/quick-start/) for more details):

    ```
    hugo new site site
    cd site
    git clone https://github.com/budparr/gohugo-theme-ananke.git themes/ananke
    rm -rf themes/ananke/.git
    echo 'theme = "ananke"' >> config.toml
    hugo new posts/my-first-post.md
    exit
    ```

3. If you have some trouble with links, you might also need to enable relative urls by using the following settings in `www/site/config.toml`:

    ```
    baseURL = ""
    relativeURLs = true
    ```

4. Restart containers and open the site on browser:

    ```
    taito stop
    taito start --clean
    taito open www
    ```

### Jekyll

1. Start a shell inside the www Docker container:

    ```
    taito shell:www
    ```

2. Create a new site:

    ```
    bash
    jekyll new site
    exit
    exit
    ```

3. Restart containers and open the site on browser:

    ```
    taito stop
    taito start --clean
    taito open www
    ```
