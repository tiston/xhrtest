import * as FileSystem from "expo-file-system";

export const uploadMedia = (
  file: any,
  uploadURL: string,
  uploadParameters: Record<string, any>,
  signal?: AbortSignal
) => {
  console.log(uploadURL, uploadParameters);
  const formData = new FormData();
  formData.append("file", file);
  Object.keys(uploadParameters).forEach((key) => {
    formData.append(key, uploadParameters[key]);
  });

  return postFormData(uploadURL, formData, "json", file.size, signal);
  //   return fetchFormData(uploadURL, formData);
};

export const uploadMedia2 = async (
  file: any,
  uploadURL: string,
  uploadParameters: Record<string, any>
) => {
  console.log(file, uploadURL);
  try {
    const task = FileSystem.createUploadTask(
      uploadURL,
      file.uri,
      {
        fieldName: "file",
        httpMethod: "POST",
        uploadType: FileSystem.FileSystemUploadType.MULTIPART,
      },
      (result) => {
        const { totalBytesSent, totalBytesExpectedToSend } = result;
        console.log(
          "UploadTask Progress:",
          totalBytesSent,
          totalBytesExpectedToSend,
          `${((totalBytesSent / totalBytesExpectedToSend) * 100).toFixed(0)}%`
        );
      }
    );

    task
      .uploadAsync()
      .then((res) => {
        if (res != null && res?.status >= 200 && res?.status < 300) {
          console.log("File Uploaded!", res);
        } else {
          console.log("Failed to upload!", res);
        }
      })
      .catch((err: Error) => {
        console.log("Failed to upload!", err);
      });
  } catch (e) {
    console.error("❌ Erreur upload :", e);
  }
};

export const postFormData = (
  url: string,
  formData: FormData,
  responseType: XMLHttpRequestResponseType = "json",
  size: number,
  signal?: AbortSignal
) => {
  console.log(formData);
  const promise = new Promise<any>((resolve, reject) => {
    const signalAbortHandler = () => {
      xhr.abort();
      clean();
    };

    signal?.addEventListener("abort", signalAbortHandler);

    const clean = () => {
      signal?.removeEventListener("abort", signalAbortHandler);
    };

    const xhr = new XMLHttpRequest();
    xhr.responseType = responseType;
    xhr.onload = () => {
      console.log("onload");
      clean();
      if (xhr.status === 200) {
        resolve(xhr.response);
      } else {
        const message =
          xhr.response?.message ??
          xhr.response?.error?.message ??
          xhr.response?.error ??
          "UploadError";
        reject(message);
      }
    };

    xhr.onerror = () => {
      clean();
      reject(new TypeError());
    };

    xhr.onabort = () => {
      clean();
      reject("abort");
    };

    xhr.upload.onprogress = (event) => {
      console.log(event, size);
    };

    xhr.open("POST", url);

    xhr.send(formData);
  });

  return promise;
};
