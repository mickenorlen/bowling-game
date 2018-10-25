import { testObj } from '../bowling';

const mockPlayersObjs = [
  // Strike not enough shots follow to calc
  // Winner and should add new shot result
  {
    name: 'player1',
    shotResult: [10, '', 10, ''],
    result: ['', 5, 12],
  },
  // Should not add new shot result
  {
    name: 'player2',
    shotResult: [10],
    result: [1, 10, 1],
  },
  // Strike enough shots follow to calc
  {
    name: 'player3',
    shotResult: [10, '', 5, 4],
    result: ['', 10, 1, 2],
  },
  // Spare not enough shots follow to calc
  {
    name: 'player4',
    shotResult: [5, 5],
    result: [''],
  },
  // Spare enough shots follow to calc
  {
    name: 'player5',
    shotResult: [5, 5, 6],
    result: [''],
  },
];

describe('Bowling', () => {
  describe('toInt', () => {
    it('Should convert string nr to int or return 0', () => {
      expect([testObj.toInt('1'), testObj.toInt('')]).toEqual([1, 0]);
    });
  });
});

describe('getWinnersMsg', () => {
  it('Should announce the player/s with highest score', () => {
    expect(testObj.getWinnerMsg(mockPlayersObjs)).toEqual(
      'The winner is player1 with 12 points!',
    );
  });
});

describe('addShotResult', () => {
  it('Should add a shotresult to player', () => {
    testObj.addShotResult(mockPlayersObjs[0], 3);
    expect(mockPlayersObjs[0].shotResult).toHaveLength(4);
  });

  it('Should not add shotresult if previous was strike', () => {
    testObj.addShotResult(mockPlayersObjs[1], 1);
    expect(mockPlayersObjs[1].shotResult).toEqual([10, '']);
  });

  it('Should add shotresult if previous was strike in last round', () => {
    testObj.addShotResult(mockPlayersObjs[1], 1, true);
    expect(mockPlayersObjs[1].shotResult[1]).not.toBe('');
  });
});

describe('addResult', () => {
  it('Should add result if two shot results follow strike', () => {
    testObj.addResult(mockPlayersObjs[0], 3);
    expect(mockPlayersObjs[0].result[0]).toBe('');
  });

  it('Should not add result if two shot results dont follow strike', () => {
    testObj.addResult(mockPlayersObjs[2], 3);
    expect(mockPlayersObjs[2].result[0]).not.toBe('');
  });

  it('Should add result if shot follow spare', () => {
    testObj.addResult(mockPlayersObjs[3], 2);
    expect(mockPlayersObjs[3].result[0]).toBe('');
  });

  it('Should not add result if shot dont follow spare', () => {
    testObj.addResult(mockPlayersObjs[4], 3);
    expect(mockPlayersObjs[4].result[0]).not.toBe('');
  });
});
