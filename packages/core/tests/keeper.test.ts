import assert from 'node:assert/strict'
import test from 'node:test'

import {
  LOCAL_KNOWLEDGE_BASE,
  LOCAL_SWEET_QUOTES,
  fetchBroadeningKnowledge,
  fetchAffectionateQuote,
  buildKeepAliveMessage,
  buildQuotaSweetNotice,
} from '../src/keeper.ts'

test('local knowledge base and sweet quotes have curated contents', () => {
  assert.ok(LOCAL_KNOWLEDGE_BASE.length >= 10, 'knowledge base has at least 10 items')
  assert.ok(LOCAL_SWEET_QUOTES.length >= 5, 'sweet quotes has at least 5 items')
  for (const item of LOCAL_KNOWLEDGE_BASE) {
    assert.equal(typeof item, 'string')
    assert.ok(item.length > 5)
  }
  for (const quote of LOCAL_SWEET_QUOTES) {
    assert.equal(typeof quote, 'string')
    assert.ok(quote.length > 3)
  }
})

test('fetchBroadeningKnowledge returns valid knowledge text', async () => {
  const text = await fetchBroadeningKnowledge()
  assert.equal(typeof text, 'string')
  assert.ok(text.length > 5)
})

test('fetchAffectionateQuote returns valid affectionate quote', async () => {
  const quote = await fetchAffectionateQuote()
  assert.equal(typeof quote, 'string')
  assert.ok(quote.length > 2)
})

test('buildKeepAliveMessage formats structure with knowledge and sweet quote', async () => {
  const message = await buildKeepAliveMessage()
  assert.ok(message.includes('今日新知 · 拓宽视野'), 'has knowledge section title')
  assert.ok(message.includes('48 小时'), 'mentions 48 hours')
  assert.ok(message.includes('保持连线'), 'mentions keep alive')
})

test('buildQuotaSweetNotice formats prefix and sweet quota notice', async () => {
  const notice = await buildQuotaSweetNotice()
  assert.ok(notice.startsWith('📮 微信这边一个回复窗口最多连发 10 条'), 'has standard quota prefix')
  assert.ok(notice.includes('悄悄提示'), 'has gentle prompt')
  assert.ok(notice.includes('连发额度刚好用到最后一条啦'), 'explains quota')
})
