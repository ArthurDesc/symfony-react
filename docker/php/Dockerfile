FROM php:8.3-fpm

# Install system dependencies
RUN apt-get update && apt-get install -y \
    git \
    curl \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    zip \
    unzip \
    libicu-dev \
    libzip-dev

# Clear cache
RUN apt-get clean && rm -rf /var/lib/apt/lists/*

# Install PHP extensions
RUN docker-php-ext-install \
    pdo_mysql \
    mbstring \
    exif \
    pcntl \
    bcmath \
    gd \
    intl \
    zip

# Install APCu
RUN pecl install apcu && \
    docker-php-ext-enable apcu

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Configure APCu
RUN echo "apc.enable_cli=1" >> /usr/local/etc/php/conf.d/docker-php-ext-apcu.ini \
    && echo "apc.enable=1" >> /usr/local/etc/php/conf.d/docker-php-ext-apcu.ini \
    && echo "apc.shm_size=256M" >> /usr/local/etc/php/conf.d/docker-php-ext-apcu.ini

# Set working directory
WORKDIR /var/www/symfony

# Create directory for vendor
RUN mkdir -p /var/www/symfony

# Copy composer files
COPY composer.* ./

# Install dependencies
RUN composer install --prefer-dist --no-dev --optimize-autoloader --no-scripts

# Copy the rest of the application
COPY . .

# Generate optimized autoloader
RUN composer dump-autoload --optimize --no-dev

# Set permissions
RUN chown -R www-data:www-data /var/www/symfony

# Expose port 9000 and start php-fpm server
EXPOSE 9000
CMD ["php-fpm"] 