import minifyTemplateLiterals from 'rollup-plugin-minify-html-literals';

export const minifyTemplateLiteralsPlugin = () => {
  return minifyTemplateLiterals({
    failOnError: true,
    options: {
      shouldMinifyCSS: () => false,
      shouldMinify({ tag = '', parts }) {
        if (tag.includes('styled')) {
          const unsafe = parts.find(p => p.text.includes('//'));

          if (unsafe) {
            let comment = '';
            try {
              comment = unsafe.text.split('//')[1].split('\n')[0].trim();
            } catch (e) {}

            throw Error(
              `Unsafe comment found in styled component: "// ${comment}". Please use /* comment */ format instead.`
            );
          }
        }

        return tag === 'gql' || tag === 'css' || tag.includes('styled');
      },
    },
  });
};
