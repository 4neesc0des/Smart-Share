// dropzone animation

const dropZone = document.querySelector(".drop-zone");
const fileInput = document.querySelector("#fileInput");
const browseBtn = document.querySelector(".browseBtn");
const bgProgress = document.querySelector(".bg-progress");
const percent = document.querySelector("#percent");
const progressBar = document.querySelector(".progress-bar");
const progressContainer = document.querySelector(".progress-container");
const fileurlInput = document.querySelector("#fileURl");
const sharingContainer = document.querySelector(".sharing-container");
const copyBtn = document.querySelector("#copy-btn");
const toast = document.querySelector(".toast");
const emailForm = document.querySelector("#emailFrom");

const host = "https://smartshare-anees.herokuapp.com/";
const uploadURL = `${host}api/files`;
const emailURL = `${host}api/files/send`;

const maxAllowedSize = 100 * 1024 * 1024;

const resetFileInput = () => {
  fileInput.value = "";
};
dropZone.addEventListener("dragover", (e) => {
  e.preventDefault();
  if (!dropZone.classList.contains("dragged")) {
    dropZone.classList.add("dragged");
  }
});

dropZone.addEventListener("dragleave", (e) => {
  dropZone.classList.remove("dragged");
});

dropZone.addEventListener("drop", (e) => {
  e.preventDefault();
  dropZone.classList.remove("dragged");
  const file = e.dataTransfer.files;
  console.log(file);
  if (file.length) {
    fileInput.files = file;
    uploadFile();
  }
});

fileInput.addEventListener("change", () => {
  uploadFile();
});

// file input
browseBtn.addEventListener("click", () => {
  fileInput.click();
});

copyBtn.addEventListener("click", () => {
  fileurlInput.select();
  document.execCommand("copy");
  showToast("link copyed");
});

// upload file
const uploadFile = () => {
  progressContainer.style.display = "block";
  if (fileInput.files.length > 1) {
    showToast("Only upload 1 file");
    resetFileInput();
    return;
  }
  file = fileInput.files[0];

  if (file.size > maxAllowedSize) {
    showToast("can't upload more than 100mb");
  }
  progressContainer.style.display = "block";

  file = fileInput.files[0];
  const formData = new FormData();
  formData.append("myfile", file);

  const xhr = new XMLHttpRequest();
  xhr.onreadystatechange = () => {
    if (xhr.readyState === XMLHttpRequest.DONE) {
      console.log(xhr.response);
      onUploadSuccess(JSON.parse(xhr.response));
    }
  };
  // uploadProgress
  xhr.upload.onprogress = updateProgress;
  xhr.upload.onerror = () => {
    resetFileInput();
    showToast(`Error in upload ${xhr.statusText}`);
  };
  xhr.open("POST", uploadURL);
  xhr.send(formData);
};

const updateProgress = (e) => {
  const percent = Math.round((e.loaded / e.total) * 100);
  console.log(percent);
  bgProgress.style.transform = `scaleX(${percent / 100})%`;
  percent.innerText = percent;
  progressBar.style.width = `${percent}%`;
};

const onUploadSuccess = ({ file: url }) => {
  fileurlInput.value = "";
  emailForm[2].removeAttribute("disabled");

  progressContainer.style.display = "none";
  sharingContainer.style.display = "block";
  fileurlInput.value = url;
};

emailForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const url = fileurlInput.value;
  const formData = {
    uuid: url.split("/").splice(-1, 1)[0],
    emailForm: emailForm.elememts["sender-email"].value,
    emailTo: emailForm.elememts["reciever-email"].value,
  };

  emailForm[2].setAttribute("disabled", "true");
  emailForm[2].innerText = "Sending";

  fetch(emailURL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        sharingContainer.style.display = "none";
        showToast("Email Sent");
      }
    });
});

const showToast = (msg) => {
  clearTimeout(toastTimer);
  toast.innerText = msg;
  toast.style.transform = "translate(-50%, 0)";

  toastTimer = setTimeout(() => {
    toast.style.transform = "translate(-50%, 10rem)";
  }, 2000);
};
