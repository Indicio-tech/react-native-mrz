import path from 'path'

import Image from 'image-js' // ).Image;

import {detect, read} from '../detector'

it('test the extraction of MRZ characters on an identity card', async () => {
  const img = await Image.load(path.join(__dirname, 'fixtures/id1.jpg'))
  let mrzImage = detect(img)
  // mrzImage.save('./test.jpg');
  let {mrz} = await read(mrzImage)
  expect(mrz).toMatchSnapshot()
}, 15000)

it('test the extraction of MRZ characters on an identity card 2', async () => {
  const img = await Image.load(path.join(__dirname, 'fixtures/id2.jpg'))
  let mrzImage = detect(img)
  let {mrz} = await read(mrzImage)
  expect(mrz).toMatchSnapshot()
}, 15000)
