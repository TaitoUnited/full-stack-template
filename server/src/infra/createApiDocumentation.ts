import { Joi } from 'koa-joi-router';
import Mustache from 'mustache';
import showdown from 'showdown';

const markdownRenderer = new showdown.Converter({
  smartIndentationFix: true,
  simpleLineBreaks: true,
});

const TEMPLATE_BASE = `
<!doctype html>
<html>
  <head>
    <meta charset="utf-8"/>
    <title>{{title}}</title>
    <link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/highlight.js/9.15.4/styles/docco.min.css">

    <style>
      html {
        scroll-behavior: smooth;
      }

      body {
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: #eaedf1;
        margin: 0;
        padding: 32px;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
      }

      p {
        line-height: 1.6;
      }

      nav {
        position: fixed;
        top: 16px;
        left: 16px;
        display: flex;
        flex-direction: column;
        background-color: #fff;
        border-radius: 8px;
        padding: 16px;
        font-size: 14px;
        box-shadow: 0px 0px 16px rgba(0,0,0,0.2);
        max-height: calc(100vh - 48px);
        will-change: transform;
        transition: transform 0.4s cubic-bezier(0.2, 0.71, 0.14, 0.91);
        transform: translateX(calc(-100% + 56px));
      }

      nav.open {
        transform: translateX(0);
      }

      nav a {
        color: #222;
        text-decoration: none;
      }

      nav > .nav-header {
        display: flex;
        justify-content: flex-end;
        flex: none;
      }

      nav > .nav-header > button {
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        align-items: center;
        border: none;
        background-color: #fff;
        border-radius: 4px;
        height: 24px;
        width: 24px;
        font-size: 16px;
        padding: 4px;
        margin: 0;
        outline: none;
      }

      nav > .nav-header > button:active {
        background-color: #f5f5f5;
      }

      nav > .nav-header > button > span {
        width: 16px;
        height: 2px;
        border-radius: 2px;
        background-color: #888;
      }

      nav > .nav-content  {
        display: none;
      }

      nav.open > .nav-content {
        flex: 1;
        overflow: auto;
        display: block;
      }

      nav > .nav-content > .nav-item {
        margin-bottom: 12px;
        display: flex;
        flex-direction: column;
      }

      .nav-content .nav-item-name {
        color: #990073;
        font-weight: 700;
        padding: 4px;
      }

      .nav-content .nav-item-endpoint {
        padding: 4px 16px;
      }

      #content {
        padding: 16px;
        background-color: #fff;
        box-shadow: 0px 2px 24px rgba(0,0,0,.1);
        border-radius: 8px;
      }

      #content > section::after {
        content: "";
        display: block;
        height: 16px;
        margin: 16px -16px;
        background-color: #f5f5f5;
        border-top: 1px solid #eee;
        border-bottom: 1px solid #eee;
      }

      #content > section:last-child::after {
        content: none;
      }

      #content > section > section {
        border-top: 1px solid #eee;
        margin-bottom: 24px;
      }

      #content > section h3 {
        color: #641784;
        font-size: 14px;
        text-transform: uppercase;
        font-weight: 700;
        margin-top: 24px;
      }

      #content > section > header > h1 {
        background-color: #641e82;
        display: inline-block;
        padding: 8px 12px;
        color: #fff;
        border-radius: 4px;
        margin-top: 0px;
        line-height: 1;
      }

      #content > section header .caller {
        font-size: 14px;
        font-style: italic;
        margin-top: 12px;
        color: #777;
        background-color: #f5f5f5;
        border: 1px solid #eee;
        border-radius: 4px;
        padding: 4px 8px;
        display: inline-block;
      }

      #content section header h2 {
        position: relative;
        padding-left: 16px;
      }

      #content section header h2::before {
        content: "";
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background-color: #86BD4A;
        position: absolute;
        left: 0;
        top: calc(50% - 4px);
      }

      pre {
        border-radius: 4px;
        max-height: 500px;
        overflow: auto;
      }

      pre > code {
        border-radius: 4px;
      }
    </style>
  </head>
  <body>
    <div id="content">{{{content}}}</div>
    <nav id="nav">
      <div class="nav-header">
        <button id="toggle-nav">
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
      <div class="nav-content">
        {{{nav}}}
      </div>
    </nav>
    <script src="//cdnjs.cloudflare.com/ajax/libs/highlight.js/9.15.4/highlight.min.js"></script>
    <script>hljs.initHighlightingOnLoad();</script>
    <script>
      function toggleNav() {
        var nav = document.getElementById("nav");
        nav.classList.toggle("open");
      }

      document.getElementById("toggle-nav").addEventListener("click", toggleNav);
    </script>
  </body>
</html>`;

const TEMPLATE_GROUP = `
<section>
  <header id="{{name}}">
    <h1>{{name}}</h1>
  </header>

  {{#routes}}
  <section>
    <header>
      <div class="caller">{{documentation.caller}}</div>
      <h2 id="{{method}} {{prefix}}{{path}}">{{method}} {{prefix}}{{path}}</h2>
      <div>{{documentation.description}}</div>
      <div>{{{documentation.extendedDescription}}}</div>
    </header>

    <section>
      <h3>Inputs</h3>
      {{#inputs}}
      <section>
        <h4>{{key}} {{#type}}({{.}}){{/type}}</h4>
        <pre><code class="json">{{value}}</code></pre>
      </section>
      {{/inputs}}
      {{^inputs}}<section>No inputs</section>{{/inputs}}
    </section>

    <section>
      <h3>Outputs</h3>
      {{#statusOutputs}}
      <section>
        <h4>Status {{status}}</h4>
        {{#outputs}}
        <section>
          <h4>{{key}} {{#type}}({{.}}){{/type}}</h4>
          <pre><code class="json">{{value}}</code></pre>
        </section>
        {{/outputs}}
      </section>
      {{/statusOutputs}}
      {{^statusOutputs}}<section>No outputs</section>{{/statusOutputs}}
    </section>
  </section>
  {{/routes}}

</section>`;

const TEMPLATE_NAV = `
<div class="nav-item">
  <a class="nav-item-name" href="#{{name}}">{{name}}</a>
  {{#routes}}
  <a class="nav-item-endpoint" href="#{{method}} {{prefix}}{{path}}">
    <span>{{method}} {{prefix}}{{path}}</span>
  </a>
  {{/routes}}
</div>`;

interface ApiGroup {
  name: string;
  prefix: string;
  routes: any[];
}

interface ApiDocOptions {
  title: string;
  groups: ApiGroup[];
}

function schemaToObject(schema: any): any {
  switch (schema.type) {
    case 'object': {
      if (schema.children) {
        return Object.keys(schema.children).reduce((obj: any, key) => {
          const subSchema = schema.children[key];

          if (subSchema.flags && subSchema.flags.strip) {
            return obj;
          }

          obj[key] = schemaToObject(subSchema);
          return obj;
        }, {});
      }
      if (schema.patterns) {
        return schema.patterns.reduce((obj: any, pattern: any) => {
          obj[`key: ${schemaToObject(pattern.schema)}`] = schemaToObject(
            pattern.rule
          );
          return obj;
        }, {});
      }
      return {};
    }
    case 'array': {
      return schema.items.map(schemaToObject);
    }
    default: {
      const presence =
        schema.flags && schema.flags.presence
          ? `${schema.flags.presence} `
          : '';
      if (schema.flags && schema.flags.allowOnly) {
        let allowed = schema.valids.map((v: string) => `"${v}"`).join('|');
        if (allowed.length >= 60) {
          allowed = `${allowed.slice(0, 60)}...`;
        }
        return `${presence}${schema.type}, allow: ${allowed}`;
      }
      return `${presence}${schema.type}`;
    }
  }
}

export default function createApiDocumentation(options: ApiDocOptions): string {
  const data = options.groups.map(group => {
    const routes = group.routes.map(route => {
      const input = route.validate || {};
      const output = input.output || {};
      return {
        ...route,
        documentation: {
          description: route.documentation.description,
          extendedDescription: markdownRenderer.makeHtml(
            route.documentation.extendedDescription
          ),
          caller: route.documentation.caller,
        },
        method: route.method.join(' / ').toUpperCase(),
        inputs: ['params', 'query', 'header', 'body']
          .filter(key => input[key])
          .map(key => ({
            key,
            type: key === 'body' ? input.type : null,
            value: JSON.stringify(
              schemaToObject(Joi.describe(input[key])),
              null,
              2
            ),
          })),
        statusOutputs: Object.keys(output).map(status => ({
          status,
          outputs: ['header', 'body']
            .filter(key => output[status][key])
            .map(key => ({
              key,
              value: JSON.stringify(
                schemaToObject(Joi.describe(output[status][key])),
                null,
                2
              ),
            })),
        })),
      };
    });

    return { ...group, routes };
  });

  const content = data.map(d => Mustache.render(TEMPLATE_GROUP, d)).join('\n');
  const nav = data.map(d => Mustache.render(TEMPLATE_NAV, d)).join('\n');

  return Mustache.render(TEMPLATE_BASE, { ...options, content, nav });
}
