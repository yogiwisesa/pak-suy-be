import {
  handleGroupChatCreated,
  handleIdKu,
  handleOrtu,
  handleGuru,
  handleAturUjian,
  handleBukuCatatan
} from '../command';
import { getReplyInline } from '../helpers';
import db from '../../db';
import { BASE_URL } from '../../constants';

beforeAll(() => {
  db.set('groups', []).write();
});

const personalMessage = {
  message_id: 347,
  from: {
    id: 133046982,
    is_bot: false,
    first_name: 'Yogi Wisesa',
    username: 'yogiwisesa',
    language_code: 'en'
  },
  chat: {
    id: 133046982,
    first_name: 'Yogi Wisesa',
    username: 'yogiwisesa',
    type: 'private'
  },
  date: 1605160916,
  text: '',
  entities: [{ offset: 0, length: 10, type: 'bot_command' }]
};

test('Should send greeting when group created', () => {
  const ctx = {
    reply: jest.fn()
  };

  const spyOnReply = jest.spyOn(ctx, 'reply');
  // @ts-ignore
  handleGroupChatCreated(ctx);

  expect(spyOnReply).toHaveBeenCalledWith(
    `Halo, Aku Pak Suy, terimakasih sudah mengajak Aku gabung di grup ya!\n\nAku akan bantu proses belajar-mengajar grup kelas kalian😄`
  );
});

test('Should return user id', () => {
  const idKuMessage = {
    message_id: 178,
    from: {
      id: 133046982,
      is_bot: false,
      first_name: 'Yogi Wisesa',
      username: 'yogiwisesa',
      language_code: 'en'
    },
    chat: {
      id: -424092170,
      title: 'Kalkulus',
      type: 'group',
      all_members_are_administrators: true
    },
    date: 1604926707,
    text: '/idku',
    entities: [{ offset: 0, length: 5, type: 'bot_command' }]
  };

  const ctx = {
    reply: jest.fn(),
    message: idKuMessage
  };

  const spyOnReply = jest.spyOn(ctx, 'reply');
  // @ts-ignore
  handleIdKu(ctx);

  expect(spyOnReply).toHaveBeenCalledWith(
    `ID kamu: ${idKuMessage.from.id}`,
    getReplyInline(idKuMessage.message_id)
  );
});

describe('Should handle set ortu', () => {
  const ortuNotPresentMessage = {
    message_id: 183,
    from: {
      id: 133046982,
      is_bot: false,
      first_name: 'Yogi Wisesa',
      username: 'yogiwisesa',
      language_code: 'en'
    },
    chat: {
      id: -424092170,
      title: 'Kalkulus',
      type: 'group',
      all_members_are_administrators: true
    },
    date: 1604927110,
    text: '/ortu',
    entities: [
      { offset: 0, length: 5, type: 'bot_command' },
      { offset: 6, length: 9, type: 'phone_number' }
    ]
  };

  const guruMessage = {
    message_id: 342,
    from: {
      id: 133046982,
      is_bot: false,
      first_name: 'Yogi Wisesa',
      username: 'yogiwisesa',
      language_code: 'en'
    },
    chat: {
      id: -424092170,
      title: 'Kalkulus',
      type: 'group',
      all_members_are_administrators: true
    },
    date: 1605160309,
    text: '/guru',
    entities: [{ offset: 0, length: 5, type: 'bot_command' }]
  };

  test('Should notify when ortu id is not present', () => {
    const ctx = {
      reply: jest.fn(),
      message: ortuNotPresentMessage,
      telegram: {
        sendMessage: jest.fn()
      }
    };

    const spyOnReply = jest.spyOn(ctx, 'reply');
    // @ts-ignore
    handleOrtu(ctx);

    expect(spyOnReply).toHaveBeenCalledWith(
      `Mohon sertakan ID orang tua mu ya 😄`,
      getReplyInline(ortuNotPresentMessage.message_id)
    );
  });

  test('Should ask to set guru before set ortu', () => {
    const ortuPresent = {
      ...ortuNotPresentMessage,
      text: '/ortu 1234'
    };

    const ctx = {
      reply: jest.fn(),
      message: ortuPresent,
      telegram: {
        sendMessage: jest.fn()
      }
    };

    const spyOnReply = jest.spyOn(ctx, 'reply');
    // @ts-ignore
    handleOrtu(ctx);

    expect(spyOnReply).toHaveBeenCalledWith(
      `Guru dari kelas ini belum diatur, mohon untuk bapak ibu guru mengirimkan pesan "/guru"`
    );
  });

  test('Should handle new guru', () => {
    const ctx = {
      reply: jest.fn(),
      message: guruMessage,
      telegram: {
        sendMessage: jest.fn()
      }
    };

    const spyOnReply = jest.spyOn(ctx, 'reply');
    // @ts-ignore
    handleGuru(ctx);
    const groups = db.get('groups').value();
    expect(groups.length).toEqual(1);
    expect(groups[0].groupName).toEqual('Kalkulus');
    expect(spyOnReply).toHaveBeenCalledWith(
      'Guru telah diatur!',
      getReplyInline(guruMessage.message_id)
    );
  });

  test('Should handle update guru', () => {
    const ctx = {
      reply: jest.fn(),
      message: guruMessage,
      telegram: {
        sendMessage: jest.fn()
      }
    };

    const spyOnReply = jest.spyOn(ctx, 'reply');
    // @ts-ignore
    handleGuru(ctx);
    expect(db.get('groups').value().length).toEqual(1);
    expect(spyOnReply).toHaveBeenCalledWith(
      'Guru berhasil diperbaharui!',
      getReplyInline(guruMessage.message_id)
    );
  });

  test('Should notify success when ortu id is present & notify parent', () => {
    const ortuPresent = {
      ...ortuNotPresentMessage,
      text: '/ortu 1234'
    };

    const ctx = {
      reply: jest.fn(),
      message: ortuPresent,
      telegram: {
        sendMessage: jest.fn()
      }
    };

    const spyOnReply = jest.spyOn(ctx, 'reply');
    const spyOnSend = jest.spyOn(ctx.telegram, 'sendMessage');
    // @ts-ignore
    handleOrtu(ctx);

    expect(spyOnReply).toHaveBeenCalledWith(
      `Berhasil dicatat 😄`,
      getReplyInline(ortuNotPresentMessage.message_id)
    );

    expect(spyOnSend).toHaveBeenCalledWith(
      1234,
      `Halo, Anda ditambahkan sebagai orang tua ${ortuPresent.from.first_name}`
    );
  });
});

test('Should handle atur ujian', () => {
  const aturujianMessage = {
    ...personalMessage,
    text: '/aturujian'
  };

  const ctx = {
    reply: jest.fn(),
    message: aturujianMessage,
    telegram: {
      sendMessage: jest.fn()
    }
  };

  const spyOnReply = jest.spyOn(ctx, 'reply');
  // @ts-ignore
  handleAturUjian(ctx);

  expect(spyOnReply).toHaveBeenCalledWith(
    `Kamu bisa mengatur ujian melalui: ${BASE_URL}/atur-ujian/${aturujianMessage.from.id}`
  );
});

test('Should handle buku catatan', () => {
  const bukucatatanMessage = {
    ...personalMessage,
    text: '/bukucatatan'
  };

  const ctx = {
    reply: jest.fn(),
    message: bukucatatanMessage,
    telegram: {
      sendMessage: jest.fn()
    }
  };

  const spyOnReply = jest.spyOn(ctx, 'reply');
  // @ts-ignore
  handleBukuCatatan(ctx);

  expect(spyOnReply).toHaveBeenCalledWith(
    `Buku catatan bisa kamu akses melalui: ${BASE_URL}/catatan/${bukucatatanMessage.from.id}`
  );
});
