Dựa trên phân tích cấu trúc project, đây là cấu trúc thư mục quan trọng của project **sudoku-classic**:

## 📁 Cấu trúc thư mục quan trọng - Sudoku Classic

### 🏗️ **Cấu trúc chính**

```
sudoku-classic/
├── 📱 app/                    # Expo Router - Các màn hình chính
│   ├── (tabs)/               # Tab navigation
│   ├── AboutGame/            # Màn hình về game
│   ├── BoardScreen/          # Màn hình chơi game
│   ├── HowToPlayScreen/      # Hướng dẫn chơi
│   ├── LeaderboardScreen/    # Bảng xếp hạng
│   ├── MainScreen/           # Màn hình chính
│   ├── OptionsScreen/        # Tùy chọn
│   ├── PlayerScreen/         # Màn hình người chơi
│   ├── SettingsScreen/       # Cài đặt
│   └── StatisticsScreen/     # Thống kê
│
├── 🧩 components/            # Các component tái sử dụng
│   ├── Board/               # Component bảng game
│   ├── commons/             # Component chung
│   ├── GameHistory/         # Lịch sử game
│   ├── HowToPlay/           # Hướng dẫn
│   ├── Leaderboard/         # Bảng xếp hạng
│   ├── Main/                # Component chính
│   ├── Player/              # Component người chơi
│   └── Statistics/          # Component thống kê
│
├── 🔧 services/             # Business logic & API
│   ├── BackgroundService.ts
│   ├── BoardService.ts
│   ├── LeaderboardService.ts
│   ├── PlayerService.ts
│   ├── QuoteService.ts
│   ├── SettingsService.ts
│   └── StatsService.ts
│
├── 💾 storage/              # Data persistence
│   ├── appStorage.ts
│   ├── gameStorage.ts
│   ├── leaderboard.ts
│   ├── migrations/          # Database migrations
│   ├── mmkv.native.ts       # Native storage
│   ├── mmkv.web.ts          # Web storage
│   ├── mock/                # Mock data
│   ├── playerProfileStorage.ts
│   └── statsStorage.ts
│
├── 🎣 hooks/                # Custom React hooks
│   ├── useAlert.ts
│   ├── useAppPause.ts
│   ├── useGameTimer.ts
│   ├── useHintCounter.ts
│   ├── useInitGame.ts
│   ├── usePlayerProfile.ts
│   └── ... (nhiều hooks khác)
│
├── 🌍 i18n/                 # Internationalization
│   ├── i18n.ts
│   ├── LanguageSwitcher.tsx
│   └── locales/
│       ├── en.json
│       ├── ja.json
│       └── vi.json
│
├── 🎨 theme/                # Styling & theming
│   └── themeStyles.ts
│
├── 📊 types/                # TypeScript type definitions
│   ├── components.ts
│   ├── game.ts
│   ├── leaderboard.ts
│   ├── player.ts
│   ├── settings.ts
│   └── stats.ts
│
├── 🛠️ utils/                # Utility functions
│   ├── boardUtil.ts
│   ├── colorUtil.ts
│   ├── dateUtil.ts
│   ├── leaderboardUtil.ts
│   ├── playerUtil.ts
│   ├── statsUtil.ts
│   └── ... (các utility khác)
│
├── 📦 assets/               # Static resources
│   ├── fonts/
│   ├── htmls/               # HTML files (licenses, policies)
│   ├── images/              # App icons & images
│   └── tutorial/            # Tutorial images
│
├── 📱 android/              # Android native code
├── 📱 ios/                  # iOS native code
│
└── 📄 Configuration files
    ├── package.json         # Dependencies & scripts
    ├── app.config.ts        # Expo configuration
    ├── tsconfig.json        # TypeScript config
    ├── eslint.config.js     # ESLint config
    └── README.md           # Project documentation
```

### �� **Các thư mục quan trọng nhất:**

1. **`app/`** - Cấu trúc navigation với Expo Router
2. **`components/`** - UI components tái sử dụng
3. **`services/`** - Business logic và API calls
4. **`storage/`** - Data persistence và local storage
5. **`hooks/`** - Custom React hooks
6. **`types/`** - TypeScript type definitions
7. **`utils/`** - Helper functions
8. **`i18n/`** - Internationalization (đa ngôn ngữ)

### �� **Công nghệ chính:**

- **React Native** + **Expo**
- **TypeScript**
- **Expo Router** (file-based routing)
- **MMKV** (fast storage)
- **React Native Google Mobile Ads**
- **i18next** (internationalization)
- **React Native Chart Kit** (charts & statistics)

Project này là một ứng dụng Sudoku hoàn chỉnh với đầy đủ tính năng: chơi game, thống kê, bảng xếp hạng, đa ngôn ngữ, và quảng cáo.
