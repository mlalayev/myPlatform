# My Platform - Kod Öyrənmə Platforması

Bu platforma proqramlaşdırma dillərini öyrənmək üçün interaktiv təlimatlar və kod icra sistemi təqdim edir.

## Arxitektura

Platforma iki hissədən ibarətdir:

1. **Next.js Web Tətbiqi** - Localhost-da işləyir
2. **Docker Servisləri** - Yalnız verilənlər bazası və kod icra üçün

### Kod İcra Sistemi

- **Local Compiler-lər**: Kodlar local sistemdə icra olunur (daha sürətli)
- **Docker Backup**: Əgər local compiler yoxdursa, Docker container-ləri istifadə olunur
- **Təhlükəsizlik**: Kodlar isolated mühitdə işləyir

## Quraşdırma

### Tələblər

- Node.js 18+ 
- Docker Desktop
- PostgreSQL (və ya Docker ilə)
- Aşağıdakı compiler-lər (local istifadə üçün):
  - Python 3.x
  - GCC (C/C++)
  - OpenJDK (Java)
  - PHP
  - .NET SDK
  - Go
  - Rust

### Quraşdırma Addımları

1. **Proyekti klonlayın:**
```bash
git clone <repository-url>
cd myPlatform
```

2. **Asılılıqları quraşdırın:**
```bash
npm install
```

3. **Mühit dəyişənlərini konfiqurasiya edin:**
```bash
cp .env.example .env
# .env faylını redaktə edin
```

4. **Verilənlər bazasını hazırlayın:**
```bash
npx prisma generate
npx prisma db push
```

5. **Development serverini başladın:**

**Seçim 1: Tam local (compiler-lər quraşdırılmalıdır)**
```bash
npm run dev
```

**Seçim 2: Docker ilə (yalnız verilənlər bazası və kod icra)**
```bash
npm run dev:docker
```

## İstifadə

1. Platforma `http://localhost:3000` ünvanında açılacaq
2. Qeydiyyatdan keçin və ya daxil olun
3. Dərsləri öyrənin və kodları icra edin

## Dəstəklənən Dillər

- Python
- C/C++
- Java
- PHP
- C#
- Go
- Rust
- JavaScript/TypeScript

## Docker Konfiqurasiyası

### Servislər

- **db**: PostgreSQL verilənlər bazası
- **code-executor**: Kod icra üçün compiler-lər və runtime-lar

### Faydalar

- **Sürət**: Local compiler-lər daha sürətli
- **Təhlükəsizlik**: Kodlar isolated mühitdə işləyir
- **Çeviklik**: Local və Docker arasında keçid mümkündür
- **Resurs Effektivliyi**: Yalnız lazım olan servislər Docker-da işləyir

## Development

### Kod İcra Sistemini Test Etmək

```bash
# Local compiler-ləri test edin
python --version
gcc --version
java --version
php --version
dotnet --version
go version
rustc --version
```

### Docker Servislərini İdarə Etmək

```bash
# Bütün servisləri başladın
docker-compose up -d

# Yalnız verilənlər bazasını başladın
docker-compose up db -d

# Servisləri dayandırın
docker-compose down

# Logları görün
docker-compose logs -f
```

## Deployment

Production üçün:

1. **Build edin:**
```bash
npm run build
```

2. **Docker ilə deploy edin:**
```bash
docker-compose -f docker-compose.prod.yml up -d
```

## Təhlükəsizlik

- Kodlar isolated mühitdə icra olunur
- Resource limitləri tətbiq olunur
- Timeout limitləri var
- Təhlükəli əməliyyatlar bloklanır

## Dəstək

Əgər problem yaşayırsınızsa:

1. Local compiler-lərin quraşdırıldığını yoxlayın
2. Docker servislərinin işlədiyini yoxlayın
3. Logları yoxlayın: `docker-compose logs`
4. Issue yaradın

## Lisenziya

MIT License