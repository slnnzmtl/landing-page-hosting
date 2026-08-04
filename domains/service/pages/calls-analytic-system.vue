<template>
  <div class="bg-slate-50 text-gray-800" style="font-family: 'Inter', sans-serif;">
    <header class="bg-white shadow-sm">
      <div class="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <h1 class="text-2xl font-bold text-blue-600">
          AI Call Analytics
        </h1>
        <a
          href="#cta"
          class="rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white transition duration-300 hover:bg-blue-700"
        >
          Замовити Демо
        </a>
      </div>
    </header>

    <main>
      <section id="hero" class="bg-white px-6 py-20 text-center">
        <div class="mx-auto max-w-4xl">
          <h2 class="mb-4 text-4xl font-bold leading-tight md:text-5xl">
            Перетворіть Розмови на Доходи
          </h2>
          <p class="mx-auto mb-8 text-lg text-gray-600 md:text-xl">
            Наша AI-платформа перетворює записи дзвінків з вашої телефонії на потужний інструмент для зростання бізнесу,
            об'єктивної оцінки та швидкого навчання команди.
          </p>
          <a
            href="#packages"
            class="inline-block rounded-lg bg-blue-600 px-8 py-3 text-lg font-bold text-white transition duration-300 hover:bg-blue-700"
          >
            Обрати свій пакет
          </a>
        </div>
      </section>

      <section id="how-it-works" class="px-6 py-16">
        <div class="mx-auto max-w-6xl">
          <div class="mb-12 text-center">
            <h3 class="text-3xl font-bold">
              Як це працює?
            </h3>
            <p class="mt-2 text-gray-600">
              Простий та автоматизований процес аналізу в три етапи.
            </p>
          </div>
          <div class="grid gap-8 text-center md:grid-cols-3">
            <div class="rounded-xl bg-white p-8 shadow-md">
              <div class="mb-4 text-4xl">
                ➡️
              </div>
              <h4 class="mb-2 text-xl font-semibold">
                1. Інтеграція та Транскрипція
              </h4>
              <p class="text-gray-600">
                Система отримує записи дзвінків з вашої IP-телефонії та точно перетворює їх на текст українською мовою.
              </p>
            </div>
            <div class="rounded-xl bg-white p-8 shadow-md">
              <div class="mb-4 text-4xl">
                🔍
              </div>
              <h4 class="mb-2 text-xl font-semibold">
                2. AI-Аналіз
              </h4>
              <p class="text-gray-600">
                Алгоритми аналізують емоційне забарвлення, ключові теми, дотримання скриптів та створюють короткий зміст розмови.
              </p>
            </div>
            <div class="rounded-xl bg-white p-8 shadow-md">
              <div class="mb-4 text-4xl">
                📊
              </div>
              <h4 class="mb-2 text-xl font-semibold">
                3. Звіти та Інсайти
              </h4>
              <p class="text-gray-600">
                Усі дані візуалізуються у зручному дашборді, надаючи вам готові інсайти для покращення роботи.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="packages" class="bg-white px-6 py-16">
        <div class="mx-auto max-w-6xl">
          <div class="mb-12 text-center">
            <h3 class="text-3xl font-bold">
              Наші пакети
            </h3>
            <p class="mt-2 text-gray-600">
              Три гнучкі рішення для бізнесу на різних етапах розвитку.
            </p>
          </div>

          <div class="mb-8 flex flex-wrap justify-center gap-2 md:gap-4">
            <button
              v-for="pkg in packages"
              :key="pkg.id"
              type="button"
              class="rounded-lg border-2 px-4 py-3 text-sm font-semibold transition duration-300 md:px-6 md:text-base"
              :class="[
                selectedPackageId === pkg.id
                  ? 'border-blue-600 bg-blue-600 text-white shadow-lg'
                  : 'border-gray-300 bg-white text-gray-700 hover:border-blue-600 hover:text-blue-600',
              ]"
              @click="selectedPackageId = pkg.id"
            >
              {{ pkg.tabLabel }}
            </button>
          </div>

          <div class="mx-auto max-w-4xl">
            <article v-if="activePackage" class="rounded-xl border bg-white p-8 shadow-lg">
              <h4 class="text-2xl font-bold">
                {{ activePackage.name }}
              </h4>
              <p class="mb-6 italic text-gray-600">
                {{ activePackage.tagline }}
              </p>

              <p class="mb-4 font-semibold">
                Що включено:
              </p>
              <ul class="mb-6 list-disc space-y-2 pl-5">
                <li v-for="feature in activePackage.features" :key="feature.key" class="text-gray-700">
                  <template v-if="feature.label">
                    <span class="font-semibold">{{ feature.label }}:</span>
                    <span> {{ feature.value }}</span>
                  </template>
                  <template v-else>
                    {{ feature.text }}
                  </template>
                </li>
              </ul>

              <div class="mb-6 rounded-lg border-l-4 border-yellow-300 bg-yellow-50 p-4">
                <p class="text-lg font-bold">
                  {{ activePackage.killerTitle }}
                </p>
                <p class="text-gray-700">
                  {{ activePackage.killerDescription }}
                </p>
              </div>

              <div class="text-center">
                <p class="text-4xl font-bold">
                  {{ activePackage.price }}
                  <span v-if="activePackage.priceSuffix" class="text-xl font-normal text-gray-500">
                    {{ activePackage.priceSuffix }}
                  </span>
                </p>
                <p v-if="activePackage.priceNote" class="text-gray-600">
                  {{ activePackage.priceNote }}
                </p>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section id="visuals" class="px-6 py-16">
        <div class="mx-auto max-w-6xl">
          <div class="mb-12 text-center">
            <h3 class="text-3xl font-bold">
              Візуалізуйте Ваші Дані
            </h3>
            <p class="mt-2 text-gray-600">
              Приклад даних, які ви зможете отримувати щодня.
            </p>
          </div>
          <div class="grid items-center gap-8 md:grid-cols-2">
            <div class="rounded-xl bg-white p-6 shadow-md">
              <h4 class="mb-4 text-center text-xl font-semibold">
                Аналіз настроїв дзвінків за день
              </h4>
              <div class="relative mx-auto h-[300px] w-full max-w-[500px] md:h-[350px]">
                <canvas ref="sentimentCanvas" class="absolute inset-0" />
              </div>
            </div>
            <div class="rounded-xl bg-white p-6 shadow-md">
              <h4 class="mb-4 text-center text-xl font-semibold">
                Співвідношення "Говорив/Слухав"
              </h4>
              <div class="relative mx-auto h-[300px] w-full max-w-[500px] md:h-[350px]">
                <canvas ref="talkListenCanvas" class="absolute inset-0" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="cta" class="bg-blue-600 px-6 py-20 text-white">
        <div class="mx-auto max-w-4xl text-center">
          <h3 class="mb-4 text-3xl font-bold md:text-4xl">
            Готові почати?
          </h3>
          <p class="mx-auto mb-8 text-lg text-blue-100 md:text-xl">
            Заплануйте 30-хвилинну онлайн-зустріч для живого демо платформи та обговорення деталей інтеграції.
          </p>
          <a
            href="#"
            class="inline-block rounded-lg bg-white px-8 py-3 text-lg font-bold text-blue-600 transition duration-300 hover:bg-gray-100"
          >
            Запланувати Демо-дзвінок
          </a>
        </div>
      </section>
    </main>

    <footer class="bg-gray-800 py-8 text-white">
      <div class="mx-auto max-w-6xl px-6 text-center">
        <p>
          &copy; 2025 AI Call Analytics. Всі права захищено.
        </p>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useHead } from '#imports'

interface PackageFeature {
  key: string
  label?: string
  value?: string
  text?: string
}

interface PackageOption {
  id: string
  tabLabel: string
  name: string
  tagline: string
  features: PackageFeature[]
  killerTitle: string
  killerDescription: string
  price: string
  priceSuffix?: string
  priceNote?: string | null
}

const packages: PackageOption[] = [
  {
    id: 'insight-starter',
    tabLabel: 'Інсайт-Стартер',
    name: 'Пакет "Інсайт-Стартер"',
    tagline: 'Ідеальний вибір для команд, які хочуть отримати значно більше, ніж просто базові звіти.',
    features: [
      { key: 'starter-accounts', label: 'Акаунти керівників', value: 'до 3' },
      { key: 'starter-calls', label: 'Аналіз дзвінків', value: 'до 500 на місяць' },
      {
        key: 'starter-features',
        text: 'Ключові функції: Універсальна інтеграція, базовий AI-аналіз (транскрипція, настрої, talk/listen ratio).',
      },
      { key: 'starter-support', label: 'Підтримка', value: 'Email' },
    ],
    killerTitle: '🔥 Killer-feature: "Автоматичний дайджест для керівника"',
    killerDescription:
      'Щоранку керівник отримує email-звіт: ШІ-саммарі 3 найбільш проблемних дзвінків та ключові показники ефективності менеджерів.',
    price: '$249',
    priceSuffix: '/ місяць',
    priceNote: null,
  },
  {
    id: 'growth-engine',
    tabLabel: 'Двигун Зростання',
    name: 'Пакет "Двигун Зростання"',
    tagline: 'Найкраще рішення для амбітних команд, що прагнуть системно покращувати свої результати.',
    features: [
      {
        key: 'growth-includes',
        text: 'Все з пакету "Інсайт-Стартер" плюс:',
      },
      { key: 'growth-accounts', label: 'Акаунти керівників', value: 'до 5 (включено)' },
      { key: 'growth-calls', label: 'Аналіз дзвінків', value: 'до 2000 на місяць' },
      { key: 'growth-features', text: 'Ключові функції: Глибока CRM-інтеграція, розширені дашборди.' },
      { key: 'growth-support', label: 'Підтримка', value: 'Пріоритетна Email та чат підтримка' },
    ],
    killerTitle: '🔥 Killer-feature: Проактивні "Сценарії коучингу"',
    killerDescription:
      'Система автоматично надсилає сповіщення керівнику, якщо виявляє відхилення в розмові, з посиланням на транскрипцію та шаблон для коучингу.',
    price: '$399',
    priceSuffix: '/ місяць',
    priceNote: '(включено до 5 користувачів)',
  },
  {
    id: 'ai-sovereign',
    tabLabel: 'Суверенний ШІ',
    name: 'Пакет "Суверенний ШІ"',
    tagline:
      'Ексклюзивне рішення для організацій з високими вимогами до безпеки та індивідуальних налаштувань.',
    features: [
      { key: 'sovereign-accounts', label: 'Акаунти керівників', value: 'Необмежено' },
      { key: 'sovereign-calls', label: 'Аналіз дзвінків', value: 'Необмежено (залежить від вашого сервера)' },
      { key: 'sovereign-features', text: 'Ключові функції: Приватне розгортання, гарантія точності української мови.' },
      { key: 'sovereign-retainer', text: 'Постійний розвиток: Річний "Інноваційний ретейнер" для оновлень.' },
      { key: 'sovereign-support', label: 'Підтримка', value: 'Виділений менеджер та технічна підтримка' },
    ],
    killerTitle: '🔥 Killer-feature: "Розробка індивідуальних воркфлоу"',
    killerDescription:
      'У вартість включено 40 годин консалтингу для створення унікальних сценаріїв автоматизації в n8n під ваші бізнес-процеси.',
    price: 'Проєкти від $7,500',
    priceNote: '(включає розгортання та 40 годин консалтингу)',
  },
]

const selectedPackageId = ref<PackageOption['id']>(packages[0].id)
const sentimentCanvas = ref<HTMLCanvasElement | null>(null)
const talkListenCanvas = ref<HTMLCanvasElement | null>(null)

type ChartInstance = import('chart.js').Chart
let sentimentChart: ChartInstance | null = null
let talkListenChart: ChartInstance | null = null

const activePackage = computed(() => packages.find(pkg => pkg.id === selectedPackageId.value) ?? packages[0])

useHead({
  title: 'AI-Платформа для Аналізу Дзвінків — AI Call Analytics',
  meta: [
    {
      name: 'description',
      content:
        'AI Call Analytics: Перетворіть записи дзвінків на інсайти. Порівняйте пакети, перегляньте візуалізації та замовте демо.',
    },
  ],
  link: [
    { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
    { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
    {
      rel: 'stylesheet',
      href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap',
    },
  ],
})

onMounted(async () => {
  const { Chart, registerables } = await import('chart.js')
  Chart.register(...registerables)

  if (sentimentCanvas.value) {
    sentimentChart = new Chart(sentimentCanvas.value, {
      type: 'doughnut',
      data: {
        labels: ['Позитивні', 'Нейтральні', 'Негативні'],
        datasets: [
          {
            label: 'Аналіз настроїв',
            data: [18, 25, 4],
            backgroundColor: [
              'rgba(75, 192, 192, 0.8)',
              'rgba(201, 203, 207, 0.8)',
              'rgba(255, 99, 132, 0.8)',
            ],
            borderColor: ['rgba(75, 192, 192, 1)', 'rgba(201, 203, 207, 1)', 'rgba(255, 99, 132, 1)'],
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
          },
        },
      },
    })
  }

  if (talkListenCanvas.value) {
    talkListenChart = new Chart(talkListenCanvas.value, {
      type: 'bar',
      data: {
        labels: ['Олена', 'Іван', 'Марія', 'Петро'],
        datasets: [
          {
            label: 'Менеджер говорив (%)',
            data: [65, 45, 55, 75],
            backgroundColor: 'rgba(54, 162, 235, 0.8)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1,
          },
          {
            label: 'Клієнт говорив (%)',
            data: [35, 55, 45, 25],
            backgroundColor: 'rgba(201, 203, 207, 0.8)',
            borderColor: 'rgba(201, 203, 207, 1)',
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            stacked: true,
          },
          y: {
            stacked: true,
            ticks: {
              callback: (value: number | string) => `${value}%`,
            },
          },
        },
        plugins: {
          legend: {
            position: 'top',
          },
        },
      },
    })
  }
})

onBeforeUnmount(() => {
  sentimentChart?.destroy()
  talkListenChart?.destroy()
})
</script>

<style scoped>
canvas {
  display: block;
}
</style>
