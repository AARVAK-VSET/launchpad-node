const request = require('supertest');
const app = require('../app');
const path = require('path');
const fs = require('fs');

describe('POST /ai/togetherai-camera Upload Middleware', () => {
  it('should reject invalid MIME types with 413', (done) => {
    // Create a dummy text file
    const txtFilePath = path.join(__dirname, 'dummy.txt');
    fs.writeFileSync(txtFilePath, 'dummy content');

    request(app)
      .post('/ai/togetherai-camera')
      .attach('image', txtFilePath)
      .expect(413)
      .expect((res) => {
        if (!res.body.error || !res.body.error.includes('Payload Too Large or Invalid MIME Type')) {
          throw new Error('Expected invalid MIME type error');
        }
      })
      .end((err) => {
        fs.unlinkSync(txtFilePath);
        if (err) return done(err);
        done();
      });
  });

  it('should reject oversized payloads with 413', (done) => {
    // Create a dummy large file (e.g. just over 10MB)
    const largeFilePath = path.join(__dirname, 'large.png');
    const largeBuffer = Buffer.alloc(11 * 1024 * 1024, 'a'); // 11 MB
    fs.writeFileSync(largeFilePath, largeBuffer);

    request(app)
      .post('/ai/togetherai-camera')
      .attach('image', largeFilePath)
      .expect(413)
      .expect((res) => {
        if (!res.body.error || !res.body.error.includes('Payload Too Large')) {
          throw new Error('Expected file size limit error');
        }
      })
      .end((err) => {
        fs.unlinkSync(largeFilePath);
        if (err) return done(err);
        done();
      });
  });
});
