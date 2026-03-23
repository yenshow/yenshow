<template>
	<div class="min-h-screen flex flex-col items-center justify-center bg-secondary p-6">
		<div class="w-full max-w-lg rounded-2xl bg-white p-8 shadow-lg border border-gray-100 text-center space-y-6">
			<div class="space-y-2">
				<h1 class="text-xl font-bold text-gray-900">{{ t("documents.open.title") }}</h1>
				<p class="text-sm text-gray-600 leading-relaxed">
					{{ t("documents.open.description") }}
				</p>
			</div>

			<div v-if="errorMessage" class="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-left text-sm text-red-700" role="alert">
				{{ errorMessage }}
			</div>

			<div v-if="isBusy" class="flex items-center justify-center gap-2 text-primary text-sm font-medium" aria-live="polite">
				<svg class="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
					<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
					<path
						class="opacity-75"
						fill="currentColor"
						d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
					/>
				</svg>
				<span>{{ t("documents.open.preparing") }}</span>
			</div>

			<div class="flex flex-col sm:flex-row gap-3 justify-center">
				<button
					v-if="!userStore.isLogin"
					type="button"
					class="inline-flex items-center justify-center rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors"
					:aria-label="t('documents.open.cta_login')"
					@click="handleOpenLoginClick"
				>
					{{ t("documents.open.cta_login") }}
				</button>
				<NuxtLink
					:to="localePath('/products')"
					class="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-6 py-3 text-sm font-semibold text-gray-800 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2 transition-colors"
					:aria-label="t('documents.open.back_products')"
				>
					{{ t("documents.open.back_products") }}
				</NuxtLink>
			</div>
		</div>

		<LoginDialog v-model="isLoginDialogOpen" @login-success="handleLoginSuccess" />
	</div>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import { useHead } from "#app";
import LoginDialog from "~/components/common/LoginDialog.vue";
import { useUserStore } from "~/stores/userStore";
const route = useRoute();
const localePath = useLocalePath();
const { t } = useI18n();
const userStore = useUserStore();
const { buildSignedSpecificationUrl } = useSpecificationPresign();

const isLoginDialogOpen = ref(false);
const isBusy = ref(false);
const errorMessage = ref("");

const rawPath = computed(() => {
	const q = route.query.path;
	if (typeof q !== "string") return "";
	return q.trim();
});

const parsedSpec = computed(() => parseSpecDocumentFromStoragePath(rawPath.value));

useHead({
	title: t("documents.open.title")
});

const tryOpenSignedDocument = async () => {
	errorMessage.value = "";

	if (!rawPath.value) {
		errorMessage.value = t("documents.open.error_no_path");
		return;
	}

	if (!parsedSpec.value) {
		errorMessage.value = t("documents.open.error_invalid_path");
		return;
	}

	if (!userStore.isLogin) {
		return;
	}

	isBusy.value = true;
	try {
		const signedUrl = await buildSignedSpecificationUrl({
			productId: parsedSpec.value.productId,
			documentUrl: parsedSpec.value.documentUrl
		});
		window.location.assign(signedUrl);
	} catch {
		errorMessage.value = t("documents.open.error_download");
	} finally {
		isBusy.value = false;
	}
};

const handleOpenLoginClick = () => {
	isLoginDialogOpen.value = true;
};

const handleLoginSuccess = async () => {
	isLoginDialogOpen.value = false;
	await tryOpenSignedDocument();
};

onMounted(async () => {
	if (userStore.isLogin) {
		await tryOpenSignedDocument();
	}
});
</script>
