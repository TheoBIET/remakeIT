import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";
import dayjs from "dayjs";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    baseImageURL: null,
    baseImageFile: null,
    baseImageFileName: null,
    baseImageFileSize: null,
    baseImageFileType: null,
    baseImageWidth: null,
    baseImageHeight: null,
    updatedImageURL: null,
    updatedImageFile: null,
    updatedImageFileName: null,
    updatedImageFileSize: null,
    updatedImageFileType: null,
    navbarActive: "filter",
    selectedFilter: "default",
    isImageLoading: false,
    newImageWidth: null,
    newImageHeight: null,
    currentCompression: 0,
    authorList: [],
  },
  getters: {},
  mutations: {
    updateNavbarActive(state, payload) {
      state.navbarActive = payload;
    },
    updateImageFileType(state, payload) {
      state.updatedImageFileType = payload;
    },
    updateFilter(state, payload) {
      state.selectedFilter = payload;
    },
    updateImageNewWidth(state, payload) {
      state.newImageWidth = payload;
    },
    updateImageNewHeight(state, payload) {
      state.newImageHeight = payload;
    },
    updateCompression(state, payload) {
      state.currentCompression = payload;
    },
    setFile(state, payload) {
      state.baseImageURL = payload.url;
      state.baseImageFile = payload.file;
      state.baseImageFileName = payload.fileName;
      state.baseImageFileSize = payload.fileSize;
      state.baseImageFileType = payload.fileType;
      state.baseImageWidth = payload.width;
      state.baseImageHeight = payload.height;
      state.updatedImageURL = payload.url;
      state.updatedImageFile = payload.file;
      state.updatedImageFileName = payload.fileName;
      state.updatedImageFileSize = payload.fileSize;
      state.updatedImageFileType = payload.fileType;
      state.updatedImageWidth = payload.width;
      state.updatedImageHeight = payload.height;
      state.isImageLoading = false;
    },
    setUpdatedFile(state, payload) {
      state.updatedImageURL = payload.url;
      state.updatedImageFile = payload.file;
      state.updatedImageFileName = payload.fileName;
      state.updatedImageFileType = payload.fileType;
      state.isImageLoading = false;
    },
    clearState(state) {
      state.baseImageURL = null;
      state.baseImageFile = null;
      state.baseImageFileName = null;
      state.baseImageFileSize = null;
      state.baseImageFileType = null;
      state.baseImageWidth = null;
      state.baseImageHeight = null;
      state.updatedImageURL = null;
      state.updatedImageFile = null;
      state.updatedImageFileName = null;
      state.updatedImageFileSize = null;
      state.updatedImageFileType = null;
      state.navbarActive = "filter";
      state.selectedFilter = "default";
      state.isImageLoading = false;
      state.newImageWidth = null;
      state.newImageHeight = null;
      state.currentCompression = 0;
    },
    setAuthorList(state, payload) {
      state.authorList = payload;
    }
  },
  actions: {
    async getUsersList({ commit }) {
      const response = await axios.get(
        "https://remake-it.herokuapp.com/api/v1/"
      );
      commit("setAuthorList", response.data?.authors);
    },
    async updateImageFileType({ state, commit }) {
      state.isImageLoading = true;
      // https://remake-it.herokuapp.com/api/v1/download
      const formData = new FormData();
      formData.append("file", state.baseImageFile);

      const res = await axios.post(
        `https://remake-it.herokuapp.com/api/v1/download?filter=${state.selectedFilter}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          responseType: "blob",
        }
      );

      const newFileType = res.headers["content-type"].split("/")[1];
      const imageName = state.baseImageFileName.split(".")[0];

      commit("setUpdatedFile", {
        url: URL.createObjectURL(res.data),
        file: res.data,
        fileName: `RemakeIT-${dayjs().format(
          "YYYY-MM-DD-HH-mm-ss"
        )}-${imageName}.${newFileType}`,
        fileType: newFileType,
      });
    },
    async requestUpdatedImageFile({ state, commit }) {
      state.isImageLoading = true;
      // https://remake-it.herokuapp.com/api/v1/download
      const formData = new FormData();
      formData.append("file", state.baseImageFile);
      const width = state.newImageWidth || state.baseImageWidth;
      const height = state.newImageHeight || state.baseImageHeight;
      const compression = 100 - state.currentCompression;

      const res = await axios.post(
        `https://remake-it.herokuapp.com/api/v1/download?extension=${state.updatedImageFileType}&filter=${state.selectedFilter}&width=${width}&height=${height}&compression=${compression}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          responseType: "blob",
        }
      );

      const newFileType = res.headers["content-type"].split("/")[1];
      const imageName = state.baseImageFileName.split(".")[0];

      commit("setUpdatedFile", {
        url: URL.createObjectURL(res.data),
        file: res.data,
        fileName: `RemakeIT-${dayjs().format(
          "YYYY-MM-DD-HH-mm-ss"
        )}-${imageName}.${newFileType}`,
        fileType: res.data.type.split("/")[1],
      });
    },
  },
  modules: {},
});
