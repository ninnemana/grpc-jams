import Vue from 'vue';
import Vuex from 'vuex';
import axios, { AxiosAdapter, AxiosResponse } from 'axios';

Vue.use(Vuex);

export default new Vuex.Store({
	state: {
		search_results: Array(),
		search_error: {},
	},
	mutations: {
		SET_SEARCH_RESULTS: (state, results) => {
			state.search_results = results;
		},
		SET_SEARCH_ERROR: (state, error) => {
			state.search_error = error;
		},
	},
	actions: {
		search({ commit }, query: string) {
			axios({
				method: 'post',
				url: `${process.env.VUE_APP_API_DOMAIN}/search`,
				data: {artist: query},
			}).then((r: AxiosResponse) => {
				const results = r.data.toString().split('\n').filter((d: string) => {
					if (d.trim() === '') {
						return;
					}

					return JSON.parse(d);
				});
				commit('SET_SEARCH_RESULTS', results);
			}).catch((error: {response: {data: {}}}) => {
				if (!error.response) {
					commit('SET_SEARCH_ERROR', 'Failed to retrieve results.');
					return;
				}

				commit('SET_SEARCH_ERROR', error.response.data);
			});
		},
	},
});