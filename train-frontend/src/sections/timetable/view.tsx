"use client";

import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useEffect, useState } from "react";
import getTimetableForRouteName from "@/services/timetable.service";
import {
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Table,
  Container,
} from "@mui/material";
import { TimetableDTO, StationDTO } from "@/types";
import { DirectionSelector } from "@/shared/components";

export default function TimeTableView() {
  const [direction, setDirection] = useState<"departure" | "arrival" | "">("");
  const [timetables, setTimetables] = useState<{
    [key: string]: TimetableDTO[];
  }>({});

  useEffect(() => {
    const directions: Array<"departure" | "arrival"> = ["departure", "arrival"];

    Promise.all(
      directions.map((dir) =>
        getTimetableForRouteName(dir).then((data) => ({
          direction: dir,
          timetables: Array.isArray(data) ? data : [data],
        }))
      )
    )
      .then((results) => {
        const timetableMap: { [key: string]: TimetableDTO[] } = {};
        results.forEach((result) => {
          timetableMap[result.direction] = result.timetables;
        });
        setTimetables(timetableMap);
      })
      .catch((err) => console.error(err));
  }, []);

  const [expanded, setExpanded] = useState<string | false>(false);

  const handleDirectionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDirection(e.target.value as "departure" | "arrival");
    setExpanded(false);
  };

  const handleChange =
    (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false);
    };

  return (
    <>
      <DirectionSelector
        direction={direction}
        handleDirectionChange={handleDirectionChange}
      />
      {direction && (
        <Container
          sx={{
            borderRadius: 4,
            boxShadow: 10,
            pt: 2,
            pb: 1,
            mt: 5,
            mb: 2,
            border: '2px solid'
          }}
        >
          {timetables[direction]?.map((route, index) => (
            <Accordion
              key={index}
              sx={{ width: "100%", mt: 2, mb: 2 }}
              expanded={expanded === `panel${index}`}
              onChange={handleChange(`panel${index}`)}
              TransitionProps={{ unmountOnExit: true }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls={`panel${index}bh-content`}
                id={`panel${index}bh-header`}
              >
                <Typography sx={{ width: "33%", flexShrink: 0 }}>
                  {route.routeName}
                </Typography>
                <Typography sx={{ color: "text.secondary" }}>
                  Train timetable
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>СТАНИЦА</TableCell>
                      {route.trains.map((train: string, tIdx: number) => (
                        <TableCell key={tIdx}>ВОЗ - {train}</TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {route.stations.map((station: StationDTO, sIdx: number) => (
                      <TableRow key={sIdx}>
                        <TableCell>{station.stationName}</TableCell>
                        {station.times.map((time, timeIdx) => (
                          <TableCell key={timeIdx}>{time}</TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </AccordionDetails>
            </Accordion>
          ))}
        </Container>
      )}
    </>
  );
}
