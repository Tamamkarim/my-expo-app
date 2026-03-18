import {fetchData} from '../src/utils/fetch-data';
import {
  checkUsernameAvailable,
  checkEmailAvailable,
  postMedia,
  postUser,
} from '../src/lib/functions';
import type {MediaItem} from '../src/types/DBTypes';
import type {RegisterInputs} from '../src/contexts/UserContext';

jest.mock('../src/utils/fetch-data', () => ({
  fetchData: jest.fn(),
}));

const mockedFetchData = fetchData as jest.MockedFunction<typeof fetchData>;

// Silence error logs from expected failure paths during tests
beforeAll(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
});

afterAll(() => {
  (console.error as jest.Mock).mockRestore();
});

describe('checkUsernameAvailable', () => {
  beforeEach(() => {
    mockedFetchData.mockReset();
  });

  it('returns true when backend reports username available', async () => {
    mockedFetchData.mockResolvedValueOnce({available: true});

    const result = await checkUsernameAvailable('newuser');

    expect(result).toBe(true);
    expect(mockedFetchData).toHaveBeenCalled();
  });

  it('returns false when backend reports username not available', async () => {
    mockedFetchData.mockResolvedValueOnce({available: false});

    const result = await checkUsernameAvailable('takenuser');

    expect(result).toBe(false);
  });

  it('returns true on network error so it does not block the form', async () => {
    mockedFetchData.mockRejectedValueOnce(new Error('network'));

    const result = await checkUsernameAvailable('anyuser');

    expect(result).toBe(true);
  });
});

describe('checkEmailAvailable', () => {
  beforeEach(() => {
    mockedFetchData.mockReset();
  });

  it('returns true when backend reports email available', async () => {
    mockedFetchData.mockResolvedValueOnce({available: true});

    const result = await checkEmailAvailable('new@example.com');

    expect(result).toBe(true);
  });

  it('returns false when backend reports email not available', async () => {
    mockedFetchData.mockResolvedValueOnce({available: false});

    const result = await checkEmailAvailable('taken@example.com');

    expect(result).toBe(false);
  });

  it('returns true on network error so it does not block the form', async () => {
    mockedFetchData.mockRejectedValueOnce(new Error('network'));

    const result = await checkEmailAvailable('any@example.com');

    expect(result).toBe(true);
  });
});

describe('postUser', () => {
  beforeEach(() => {
    mockedFetchData.mockReset();
  });

  it('returns true when registration succeeds', async () => {
    mockedFetchData.mockResolvedValueOnce({});

    const inputs: RegisterInputs = {
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123',
      confirmPassword: 'password123',
    };

    const result = await postUser(inputs);

    expect(result).toBe(true);
    expect(mockedFetchData).toHaveBeenCalled();
  });

  it('returns false when registration fails', async () => {
    mockedFetchData.mockRejectedValueOnce(new Error('fail'));

    const inputs: RegisterInputs = {
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123',
      confirmPassword: 'password123',
    };

    const result = await postUser(inputs);

    expect(result).toBe(false);
  });
});

describe('postMedia', () => {
  beforeEach(() => {
    mockedFetchData.mockReset();
    process.env.EXPO_PUBLIC_MEDIA_API = 'https://example.test/media-api/api/v1';
  });

  it('returns created media item on success', async () => {
    const fakeMedia: MediaItem = {
      media_id: 1,
      user_id: 1,
      title: 'Test',
      description: 'Desc',
    };

    mockedFetchData.mockResolvedValueOnce(fakeMedia);

    const result = await postMedia(
      {
        title: 'Test',
        description: 'Desc',
        filename: 'file.jpg',
        media_type: 'image/jpeg',
      },
      'token-123',
    );

    expect(result).toEqual(fakeMedia);
    expect(mockedFetchData).toHaveBeenCalled();
  });

  it('returns null when backend call fails', async () => {
    mockedFetchData.mockRejectedValueOnce(new Error('fail'));

    const result = await postMedia(
      {
        title: 'Test',
        description: 'Desc',
        filename: 'file.jpg',
        media_type: 'image/jpeg',
      },
      'token-123',
    );

    expect(result).toBeNull();
  });
});
