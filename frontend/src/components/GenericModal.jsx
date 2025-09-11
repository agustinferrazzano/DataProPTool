import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Stack, Typography, Box } from "@mui/material";

// Puedes pasar un prop "selectSection" para renderizar selects personalizados
function GenericModal({
  open,
  onClose,
  onSubmit,
  title,
  submitText = "Guardar",
  cancelText = "Cancelar",
  children,
  selectSection = null, // <-- Nuevo prop opcional
  ...props
}) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: { minHeight: 300, maxHeight: 1000},
      }}
      {...props}
    >
      <form onSubmit={onSubmit}>
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} mt={1}>
            {children}
            {selectSection && (
              <Stack spacing={1}>
                <Box sx={{
                  ".multi-select__control": {
                    borderRadius: 2,
                    borderColor: "primary.main",
                    minHeight: 48,
                    zIndex: 1302,
                  },
                  ".multi-select__multi-value": {
                    backgroundColor: "primary.light",
                    zIndex: 1302,
                  },
                  ".multi-select__option--is-focused": {
                    backgroundColor: "primary.lighter",
                  },
                  ".multi-select__option--is-selected": {
                    backgroundColor: "primary.main",
                    color: "#fff",
                  },
                  ".multi-select__menu": {
                    zIndex: 1302,
                    maxHeight: 500,
                  },
                  ".multi-select__placeholder": {
                    color: "text.secondary",
                  },
                  ".multi-select__single-value": {
                    color: "text.primary",
                  },
                }}>
                  {selectSection}
                </Box>
              </Stack>
            )}
          </Stack>
   
        </DialogContent>
        <DialogActions>
            <Button onClick={onClose} color="secondary">
                {cancelText}
            </Button>
            <Button type="submit" variant="contained" color="primary">
                {submitText}
            </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

export default GenericModal;