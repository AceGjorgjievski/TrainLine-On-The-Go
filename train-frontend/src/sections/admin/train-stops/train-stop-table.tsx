import { TrainStop } from "@/types";
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
  TableHead,
  Button,
  Typography,
  colors,
  Stack,
} from "@mui/material";

type SortKey = "trainStop.name" | "stationSequenceNumber";

interface Props {
  stops: TrainStop[];
  page: number;
  rowsPerPage: number;
  onEdit: (stop: TrainStop) => void;
  onDelete: (stop: TrainStop) => void;
  handleSortRequest: (key: SortKey) => void;
  handleSortIcon: (key: SortKey) => string | null;
}

export default function TrainStopTable({
  stops,
  page,
  rowsPerPage,
  onEdit,
  onDelete,
  handleSortRequest,
  handleSortIcon,
}: Props) {
  const paginated = stops.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell
            onClick={() => handleSortRequest("trainStop.name")}
            sx={{
              cursor: "pointer",
              textDecoration: "underline",
              width: 200,
            }}
            align="center"
          >
            <Typography sx={{ fontWeight: "bold", textAlign: "center" }}>
              Station Name {handleSortIcon("trainStop.name")}
            </Typography>
          </TableCell>
          <TableCell align="center">
            <Typography sx={{ fontWeight: "bold", textAlign: "center" }}>
              Actions
            </Typography>
          </TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {paginated.map((stop, index) => (
          <TableRow
            key={stop.id || index}
            sx={{
              bgcolor: index % 2 === 0 ? colors.blue[50] : "white",
            }}
          >
            <TableCell align="center">
              <Typography sx={{ textAlign: "center" }}>{stop.name}</Typography>
            </TableCell>
            {/* <TableCell align="center">
              <Button onClick={() => onEdit(stop)} color="warning">
                Edit
              </Button>
              <Button onClick={() => onDelete(stop)} color="error">
                Delete
              </Button>
            </TableCell> */}
            <TableCell>
              <Stack direction="row" spacing={2} justifyContent="center">
                <Button
                  variant="contained"
                  color="warning"
                  size="small"
                  onClick={() => {
                    onEdit(stop);
                  }}
                >
                  Edit
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  size="small"
                  onClick={() => {
                    onDelete(stop);
                  }}
                >
                  Delete
                </Button>
              </Stack>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
