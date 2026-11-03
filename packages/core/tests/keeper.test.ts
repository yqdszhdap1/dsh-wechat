import assert from 'node:assert/strict'
import test from 'node:test'

import {
  LOCAL_KNOWLEDGE_BASE,
  LOCAL_SWEET_QUOTES,
  fetchBroadeningKnowledge,
  fetchAffectionateQuote,
  buildKeepAliveMessage,
  buildQuotaSweetNotice,
  parseDndRange,
  adjustTargetForDnd,
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

test('parseDndRange parses normal and invalid ranges', () => {
  assert.deepEqual(parseDndRange('23:00-08:00'), { startMinutes: 23 * 60, endMinutes: 8 * 60 })
  assert.deepEqual(parseDndRange('01:30 - 06:15'), { startMinutes: 1 * 60 + 30, endMinutes: 6 * 60 + 15 })
  assert.equal(parseDndRange(''), undefined)
  assert.equal(parseDndRange('invalid'), undefined)
})

test('adjustTargetForDnd advances timestamp when inside DND window', () => {
  // Midnight crossing DND: 23:00 - 08:00
  // Target at 04:30 AM on 2026-11-06
  const targetEarlyMorning = new Date(2026, 10, 6, 4, 30, 0, 0).getTime()
  const adjustedMorning = adjustTargetForDnd(targetEarlyMorning, '23:00-08:00')
  const dateMorning = new Date(adjustedMorning)
  assert.equal(dateMorning.getDate(), 5, 'advanced to previous day')
  assert.equal(dateMorning.getHours(), 23, 'advanced to 23:00')
  assert.equal(dateMorning.getMinutes(), 0)

  // Target at 23:45 on 2026-11-05
  const targetLateNight = new Date(2026, 10, 5, 23, 45, 0, 0).getTime()
  const adjustedNight = adjustTargetForDnd(targetLateNight, '23:00-08:00')
  const dateNight = new Date(adjustedNight)
  assert.equal(dateNight.getDate(), 5, 'same day')
  assert.equal(dateNight.getHours(), 23, 'advanced to 23:00')
  assert.equal(dateNight.getMinutes(), 0)

  // Target at 14:00 (outside DND)
  const targetDay = new Date(2026, 10, 6, 14, 0, 0, 0).getTime()
  assert.equal(adjustTargetForDnd(targetDay, '23:00-08:00'), targetDay, 'unchanged when outside DND')
})
