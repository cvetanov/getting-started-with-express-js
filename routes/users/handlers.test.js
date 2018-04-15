import {
  renderUsers,
  downloadUsers
} from './handlers';

describe('Users Route tests', () => {
  it('should render users', () => {
    const req = {};
    const res = {
      render: jest.fn()
    };

    const users = [];

    // When
    renderUsers(req, res, users);

    // Then
    expect(res.render).toHaveBeenCalledWith('users', { users });
  });

  it('should send the users.json file to download', () => {
    // Given
    const req = {};
    const res = {
      download: jest.fn()
    };

    // When
    downloadUsers(req, res);

    // Then
    expect(res.download).toHaveBeenCalledWith('./users.json');
  });
});
