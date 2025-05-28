import React from "react";
import { Table, TableBody, TableCell, TableHead, TableRow, Checkbox, Button } from "@mui/material";

function ClassificationMatrix({ dataProblems, matrix, setMatrix, onCalculate, aggFunc, results }) {
  const handleToggle = (rowIdx, colIdx) => {
    const newMatrix = matrix.map((row, r) =>
      row.map((val, c) => (r === rowIdx && c === colIdx ? !val : val))
    );
    setMatrix(newMatrix);
  };

  return (
    <>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Data Problem</TableCell>
            {[...Array(10)].map((_, idx) => (
              <TableCell key={idx} align="center">{idx + 1}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {dataProblems.map((dp, rowIdx) => (
            <TableRow key={dp.id}>
              <TableCell>{dp.nombre}</TableCell>
              {[...Array(10)].map((_, colIdx) => (
                <TableCell key={colIdx} align="center">
                  <Checkbox
                    checked={!!matrix[rowIdx][colIdx]}
                    onChange={() => handleToggle(rowIdx, colIdx)}
                  />
                </TableCell>
              ))}
            </TableRow>
          ))}
          <TableRow>
            <TableCell><b>Total ({aggFunc})</b></TableCell>
            {results.map((val, idx) => (
              <TableCell key={idx} align="center">
                <b>{val}</b>
              </TableCell>
            ))}
          </TableRow>
        </TableBody>
      </Table>
    </>
  );
}

export default ClassificationMatrix;