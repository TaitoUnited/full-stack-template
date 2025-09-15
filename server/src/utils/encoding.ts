type Coder = (_: string) => string;

function encoder(c: BufferEncoding): Coder {
  return (s) => Buffer.from(s, 'ascii').toString(c);
}

function decoder(c: BufferEncoding): Coder {
  return (s) => Buffer.from(s, c).toString('ascii');
}

function make(c: BufferEncoding) {
  return {
    encode: encoder(c),
    decode: decoder(c),
  };
}

export const base64 = make('base64');
export const base64url = make('base64url');
export const hex = make('hex');
export const binary = make('binary');
