
import {
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";

export default function MultipleSelect({ value, onChange, options, label }) {
  return (
    <FormControl fullWidth sx={{ mb: 4, width: '15%' }}>
      <InputLabel
        sx={{ color: "black" }}
        id="select-label"
      >
        {label}
      </InputLabel>
      <Select
        labelId="select-label"
        value={value}
        label={label}
        onChange={(e) => onChange(e.target.value)}
        sx={{
          color: "black",
          backgroundColor: "white",
          ".MuiOutlinedInput-notchedOutline": {
            borderColor: "black",
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "black",
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "gray",
          },
        }}
        MenuProps={{
          PaperProps: {
            sx: {
              bgcolor: "white",
              color: "black",
            },
          },
        }}
      >
        <MenuItem value="">All Semesters</MenuItem>
        {options.map((opt, idx) => (
          <MenuItem
            key={idx}
            value={opt}
            sx={{ color: "black", backgroundColor: "white" }}
          >
            {opt}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

