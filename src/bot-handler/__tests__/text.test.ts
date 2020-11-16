import dayjs from 'dayjs';
import { getReplyInline } from '../helpers';
import textHandler, { handleCatat, handleKata } from '../text';
import db from '../../db';

beforeAll(() => {
  db.set('notes', []).write();
});

describe('Should handle catat', () => {
  const catatMessage = {
    message_id: 187,
    from: {
      id: 133046982,
      is_bot: false,
      first_name: 'Yogi Wisesa',
      username: 'yogiwisesa',
      language_code: 'en'
    },
    chat: {
      id: -12332,
      title: 'Kalkulus-2',
      type: 'group',
      all_members_are_administrators: true
    },
    date: 1604927873,
    text: 'mantap #catat',
    entities: [{ offset: 7, length: 6, type: 'hashtag' }]
  };

  test('Should handle catat correctly when db note is empty', () => {
    const ctx = {
      reply: jest.fn(),
      message: catatMessage
    };

    const spyOnReply = jest.spyOn(ctx, 'reply');

    // @ts-ignore
    handleCatat(ctx);

    expect(spyOnReply).toHaveBeenCalledWith(
      'Sudah aku catat ya 🙂',
      getReplyInline(catatMessage.message_id)
    );

    const notes = db.get('notes').value();
    const expectedNotes = [
      {
        groupName: 'Kalkulus-2',
        groupId: -12332,
        date: dayjs().format('YYYY-MM-DD'),
        notes: [{ from: 'Yogi Wisesa', body: 'mantap' }]
      }
    ];

    expect(notes).toEqual(expectedNotes);
  });

  test('Should handle catat correctly when db note is not empty', () => {
    const ctx = {
      reply: jest.fn(),
      message: catatMessage
    };

    const spyOnReply = jest.spyOn(ctx, 'reply');

    // @ts-ignore
    handleCatat(ctx);

    expect(spyOnReply).toHaveBeenCalledWith(
      'Sudah aku catat ya 🙂',
      getReplyInline(catatMessage.message_id)
    );

    const notes = db.get('notes').value();

    const expectedNotes = [
      {
        groupName: 'Kalkulus-2',
        groupId: -12332,
        date: '2020-11-10',
        notes: [
          { from: 'Yogi Wisesa', body: 'mantap' },
          { from: 'Yogi Wisesa', body: 'mantap' }
        ]
      }
    ];

    expect(notes).toEqual(expectedNotes);
  });
});

test('Should handle textHandler correctly', () => {
  const message = {
    message_id: 187,
    from: {
      id: 133046982,
      is_bot: false,
      first_name: 'Yogi Wisesa',
      username: 'yogiwisesa',
      language_code: 'en'
    },
    chat: {
      id: -12332,
      title: 'Kalkulus-2',
      type: 'group',
      all_members_are_administrators: true
    },
    date: 1604927873,
    text: 'Apa benar seperti itu?',
    entities: [{ offset: 7, length: 6, type: 'hashtag' }]
  };

  const ctx = {
    reply: jest.fn(),
    message
  };

  // process.nextTick(() => {
  //   // @ts-ignore
  //   const questionResponse = textHandler(ctx);
  //   expect(questionResponse).toEqual('kata');
  // });

  const ctx2 = {
    reply: jest.fn(),
    message: {
      ...message,
      text: 'Pada jaman dahulu #catat'
    }
  };

  // @ts-ignore
  const catatResponse = textHandler(ctx2);
  expect(catatResponse).toEqual('catat');
});
