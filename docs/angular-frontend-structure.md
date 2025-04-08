---
layout: default
title: Frontend Structure
nav_order: 5
---

# Angular Frontend Structure
{: .no_toc }

## Table of contents
{: .no_toc .text-delta }

1. TOC
{:toc}

## Directory Structure

The Angular frontend follows a modular organization pattern:

![Frontend](screenshots/frontend-folder-structure.png)

## Key Components

The frontend is organized with the following key directories:

- **src/app/core**: Contains services, guards, and interceptors
- **src/app/features**: Feature modules (contacts, authentication)
- **src/app/shared**: Reusable components, directives, and pipes
- **src/assets**: Static assets like images and icons
- **src/environments**: Environment-specific configuration

## Angular Modules

The application is divided into the following modules:

1. **AppModule**: Root module
2. **CoreModule**: Services and guards
3. **SharedModule**: Reusable components
4. **ContactsModule**: Contact management feature
5. **AuthModule**: Authentication feature
