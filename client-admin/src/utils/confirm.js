import Swal from "sweetalert2";

export async function confirmDelete(
  title = "Delete item?",
  text = "This action cannot be undone.",
) {
  const result = await Swal.fire({
    title,
    text,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#ec2a2aff",
    cancelButtonColor: "#a0aec0",
    confirmButtonText: "Yes, delete it",
    cancelButtonText: "Cancel",
    reverseButtons: false,
    focusCancel: false,
    focusConfirm: true,
  });

  return result.isConfirmed;
}

export function showSuccess(message, title = "Success!") {
  return Swal.fire({
    icon: "success",
    title,
    text: message,
    timer: 2000,
    timerProgressBar: true,
    showConfirmButton: false,
    position: "top-end",
    toast: true,
  });
}

export function showError(message, title = "Error") {
  return Swal.fire({
    icon: "error",
    title,
    text: message,
    confirmButtonColor: "#48bb78",
    confirmButtonText: "OK",
  });
}

export function showInfo(message, title = "Info") {
  return Swal.fire({
    icon: "info",
    title,
    text: message,
    confirmButtonColor: "#4299e1",
    confirmButtonText: "OK",
  });
}

export function showConfirm(
  title,
  text,
  confirmButtonText = "Confirm",
  cancelButtonText = "Cancel",
) {
  return Swal.fire({
    title,
    text,
    icon: "question",
    showCancelButton: true,
    confirmButtonColor: "#48bb78",
    cancelButtonColor: "#a0aec0",
    confirmButtonText,
    cancelButtonText,
    reverseButtons: false,
  }).then((result) => result.isConfirmed);
}

export async function confirmPublishAction(action, itemName) {
  const isPublish = action === "publish";
  const title = isPublish ? "Publish post?" : "Unpublish post?";
  const text = isPublish
    ? `Are you sure you want to publish "${itemName}"?`
    : `Are you sure you want to unpublish "${itemName}"?`;

  const result = await Swal.fire({
    title,
    text,
    icon: "question",
    showCancelButton: true,
    confirmButtonColor: isPublish ? "#48bb78" : "#ed8936",
    cancelButtonColor: "#a0aec0",
    confirmButtonText: isPublish ? "Yes, publish it" : "Yes, unpublish it",
    cancelButtonText: "Cancel",
    reverseButtons: false,
  });

  return result.isConfirmed;
}
