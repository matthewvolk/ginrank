import { Fragment } from 'react';

import type { SelectPlayer } from '@/db/schema';

interface ScoresheetProps {
  players: SelectPlayer[];
  scoresheet: Map<string, number[][]>;
}

export async function Scoresheet({ players, scoresheet }: ScoresheetProps) {
  const maxRows = Math.max(
    ...Array.from(scoresheet.values()).map((scores) =>
      Math.max(...scores.map((score) => score.length)),
    ),
  );

  return (
    <div className="flex flex-col gap-4 rounded-md border p-4">
      <h2 className="text-lg font-bold">Scoresheet</h2>
      <table className="border-collapse border text-center">
        <thead>
          <tr>
            {players.map((p) => (
              <th className="border-collapse border" colSpan={3} key={p.id}>
                {p.name}
              </th>
            ))}
          </tr>
          <tr>
            {players.map((p) => (
              <Fragment key={p.id}>
                <th className="border-collapse border">Game 1</th>
                <th className="border-collapse border">Game 2</th>
                <th className="border-collapse border">Game 3</th>
              </Fragment>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: maxRows }).map((_, rowIdx) => (
            <tr key={rowIdx}>
              {players.map((p) => {
                const cols = scoresheet.get(p.id) ?? [];
                const [col1 = [], col2 = [], col3 = []] = cols;
                return (
                  <Fragment key={p.id}>
                    <td className="border-collapse border">
                      {col1[rowIdx] ?? ''}
                    </td>
                    <td className="border-collapse border">
                      {col2[rowIdx] ?? ''}
                    </td>
                    <td className="border-collapse border">
                      {col3[rowIdx] ?? ''}
                    </td>
                  </Fragment>
                );
              })}
            </tr>
          ))}
        </tbody>

        <tfoot>
          <tr>
            <td
              className="border-collapse border text-center font-bold"
              colSpan={players.length * 3}
            >
              Totals
            </td>
          </tr>
          <tr>
            {players.map((p) => {
              const cols = scoresheet.get(p.id) ?? [];
              const [col1 = [], col2 = [], col3 = []] = cols;
              const sum = (arr: number[]) =>
                arr.reduce((acc, val) => acc + val, 0);
              return (
                <Fragment key={p.id}>
                  <td className="border-collapse border font-bold">
                    {sum(col1)}
                  </td>
                  <td className="border-collapse border font-bold">
                    {sum(col2)}
                  </td>
                  <td className="border-collapse border font-bold">
                    {sum(col3)}
                  </td>
                </Fragment>
              );
            })}
          </tr>
        </tfoot>
      </table>
    </div>
  );
}
