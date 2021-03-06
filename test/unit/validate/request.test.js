import test from 'ava'
import isolate from 'helper/isolate'
import { assay as makeAssay } from 'make'
const [request, { cookies, headers, postData, queryString }] = isolate(
  test,
  'validate/request',
  {
    cookies: 'validate/cookies',
    headers: 'validate/headers',
    postData: 'validate/postData',
    queryString: 'validate/queryString',
  }
)

test.serial('missing method', (t) => {
  t.throws(
    () => {
      request({}, 0, makeAssay())
    },
    { name: 'MissingRequestMethod' }
  )
})

test.serial('invalid method', (t) => {
  t.throws(
    () => {
      request({ method: 5 }, 0, makeAssay())
    },
    { name: 'InvalidRequestMethod' }
  )
})

test.serial('missing url', (t) => {
  t.throws(
    () => {
      request({ method: 'GET' }, 0, makeAssay())
    },
    { name: 'MissingRequestUrl' }
  )
})

test.serial('invalid url type', (t) => {
  t.throws(
    () => {
      request({ method: 'GET', url: 5 }, 0, makeAssay())
    },
    {
      name: 'InvalidRequestUrl',
      message: 'Invalid request url (0): must be string',
    }
  )
})

test.serial('invalid url format', (t) => {
  t.throws(
    () => {
      request({ method: 'GET', url: 'example.com' }, 0, makeAssay())
    },
    {
      name: 'InvalidRequestUrl',
      message:
        'Invalid request url (0): must be absolute or start with variable',
    }
  )
})

test.serial('invalid queryString', (t) => {
  t.throws(
    () => {
      request(
        {
          method: 'GET',
          url: 'http://example.com',
          queryString: 5,
        },
        0,
        makeAssay()
      )
    },
    { name: 'InvalidRequestQuery' }
  )
})

test.serial('invalid headers', (t) => {
  t.throws(
    () => {
      request(
        {
          method: 'GET',
          url: 'http://example.com',
          headers: 5,
        },
        0,
        makeAssay()
      )
    },
    { name: 'InvalidRequestHeaders' }
  )
})

test.serial('invalid cookies', (t) => {
  t.throws(
    () => {
      request(
        {
          method: 'GET',
          url: 'http://example.com',
          cookies: 5,
        },
        0,
        makeAssay()
      )
    },
    { name: 'InvalidRequestCookies' }
  )
})

test.serial('invalid postData', (t) => {
  t.throws(
    () => {
      request(
        {
          method: 'GET',
          url: 'http://example.com',
          postData: 5,
        },
        0,
        makeAssay()
      )
    },
    { name: 'InvalidRequestData' }
  )
})

test.serial('invalid comment', (t) => {
  t.throws(
    () => {
      request(
        {
          method: 'GET',
          url: 'http://example.com',
          comment: 5,
        },
        0,
        makeAssay()
      )
    },
    { name: 'InvalidComment' }
  )
})

test.serial('GET with body', (t) => {
  t.throws(
    () => {
      request(
        {
          method: 'GET',
          url: 'http://example.com',
          postData: { mimeType: 'text/csv' },
        },
        0,
        makeAssay()
      )
    },
    { name: 'InvalidRequestData' }
  )
})

test.serial('inconsistent Content-Type', (t) => {
  t.throws(
    () => {
      request(
        {
          method: 'POST',
          url: 'http://example.com',
          headers: [{ name: 'Content-Type', value: 'text/plain' }],
          postData: { mimeType: 'text/csv' },
        },
        0,
        makeAssay()
      )
    },
    { name: 'InconsistentContentType' }
  )
})

test.serial('consistent Content-Type', (t) => {
  t.notThrows(() => {
    request(
      {
        method: 'POST',
        url: 'http://example.com',
        headers: [{ name: 'Content-Type', value: 'text/csv; charset=utf-8' }],
        postData: { mimeType: 'text/csv' },
      },
      0,
      makeAssay()
    )
  })
})

test.serial('valid http url', (t) => {
  request({ method: 'GET', url: 'http://example.com' }, 0, makeAssay())
  t.true(queryString.notCalled)
  t.true(headers.notCalled)
  t.true(cookies.notCalled)
  t.true(postData.notCalled)
})

test.serial('valid https url', (t) => {
  request({ method: 'GET', url: 'https://example.com' }, 0, makeAssay())
  t.true(queryString.notCalled)
  t.true(headers.notCalled)
  t.true(cookies.notCalled)
  t.true(postData.notCalled)
})

test.serial('valid ftp url', (t) => {
  request({ method: 'GET', url: 'ftp://example.com' }, 0, makeAssay())
  t.true(queryString.notCalled)
  t.true(headers.notCalled)
  t.true(cookies.notCalled)
  t.true(postData.notCalled)
})

test.serial('valid variable url', (t) => {
  /* eslint-disable-next-line no-template-curly-in-string */
  request({ method: 'GET', url: '${base}/index.html' }, 0, makeAssay())
  t.true(queryString.notCalled)
  t.true(headers.notCalled)
  t.true(cookies.notCalled)
  t.true(postData.notCalled)
})

test.serial('valid full', (t) => {
  request(
    {
      method: 'GET',
      url: 'http://example.com',
      queryString: [],
      headers: [],
      cookies: [],
      postData: {},
      comment: 'Load front page',
    },
    0,
    makeAssay()
  )
  t.true(queryString.calledOnce)
  t.true(headers.calledOnce)
  t.true(cookies.calledOnce)
  t.true(postData.calledOnce)
})
