## Configuration

Configure static site generator of your choice with the following instructions. Currently instructions are provided only for Gatsby, Hugo and Jekyll, but with some extra work the server-template may easily be used with any static site generator.

Remove static site generators that you do not use from `www/install.sh`.

    EDIT www/install.sh

Start containers, and start a shell inside the www Docker container:

    taito start
    taito shell:www

*FOR PLAIN STATIC FILES:* Exit the shell and add static files to www/assets with your code editor.

*FOR GATSBY ONLY:* Create a new Gatsby site based on one of the [starters](https://www.gatsbyjs.org/starters?v=2) (NOTE: Select 'npm' as package manager and ignore the 'git commit' error):

    su node
    npx gatsby new site https://github.com/sarasate/gate
    rm -rf site/.git
    exit
    exit

*FOR GATSBY ONLY:* Edit some files:

    EDIT docker-compose.yaml         # Enable `/service/site/node_modules` mount
    EDIT www/site/gatsby-config.js   # Add pathPrefix setting: `pathPrefix: '/docs'`
    EDIT taito-config.sh             # Add link: `* www-local=http://localhost:7463/docs Local docs`

> The additional link is required because `commons.js` and `socket.io` are assumed to be running on `/` path (See [Gatsby.js issue](https://github.com/gatsbyjs/gatsby/issues/3721)).

*FOR HUGO ONLY:* Create a new Hugo site (See [Hugo themes](https://themes.gohugo.io/) and [Hugo quick start](https://gohugo.io/getting-started/quick-start/) for more details):

    hugo new site site
    cd site
    git clone https://github.com/budparr/gohugo-theme-ananke.git themes/ananke
    rm -rf themes/ananke/.git
    echo 'theme = "ananke"' >> config.toml
    hugo new posts/my-first-post.md
    exit

*FOR HUGO ONLY:* If you have some trouble with links, you might also need to enable relative urls by using the following settings in `www/site/config.toml`:

    baseURL = ""
    relativeURLs = true

*FOR JEKYLL ONLY:* Create a new site:

    bash
    jekyll new site
    exit
    exit

Restart containers and open the site on browser:

    taito stop
    taito start --clean
    taito open www
