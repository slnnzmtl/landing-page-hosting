<template>
  <div :class="['vue-body-class', { 'menu-open': isMobileMenuOpen }]">
    <header class="elementor elementor-47 elementor-location-header" data-elementor-type="header" data-elementor-id="47">
      <section
        ref="header"
        class="elementor-section elementor-top-section elementor-element elementor-element-f134618 elementor-hidden-mobile header elementor-section-boxed elementor-section-height-default elementor-section-height-default elementor-sticky elementor-section--handles-inside"
        data-id="f134618"
        data-element_type="section"
      >
        <div class="elementor-container elementor-column-gap-default">
          <div
            class="elementor-column elementor-col-100 elementor-top-column elementor-element elementor-element-ffd5bc9"
            data-id="ffd5bc9"
            data-element_type="column"
          >
            <div class="elementor-widget-wrap elementor-element-populated">
              <section
                class="elementor-section elementor-inner-section elementor-element elementor-element-155bebb elementor-section-height-min-height elementor-section-content-middle elementor-section-boxed elementor-section-height-default"
                data-id="155bebb"
                data-element_type="section"
              >
                <div class="elementor-container elementor-column-gap-default">
                  <div
                    class="elementor-column elementor-col-50 elementor-inner-column elementor-element elementor-element-b820118"
                    data-id="b820118"
                    data-element_type="column"
                  >
                    <div class="elementor-widget-wrap elementor-element-populated">
                      <div
                        class="elementor-element elementor-element-000c07b elementor-widget elementor-widget-image"
                        data-id="000c07b"
                        data-element_type="widget"
                        data-widget_type="image.default"
                      >
                        <div class="elementor-widget-container">
                          <a href="https://phygital.plus">
                            <img
                              width="181"
                              height="35"
                              src="https://phygital.plus/wp-content/uploads/2025/06/PhygitalLogo.svg"
                              class="attachment-full size-full wp-image-1366"
                              alt=""
                            /> </a>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div
                    class="elementor-column elementor-col-50 elementor-inner-column elementor-element elementor-element-081c15a"
                    data-id="081c15a"
                    data-element_type="column"
                  >
                    <div class="elementor-widget-wrap elementor-element-populated">
                      <div
                        class="elementor-element elementor-element-0efb77c elementor-nav-menu--stretch elementor-widget__width-auto elementor-nav-menu--dropdown-tablet elementor-nav-menu__text-align-aside elementor-nav-menu--toggle elementor-nav-menu--burger elementor-widget elementor-widget-nav-menu"
                        data-id="0efb77c"
                        data-element_type="widget"
                        data-widget_type="nav-menu.default"
                      >
                        <div class="elementor-widget-container">
                          <nav
                            aria-label="Menu"
                            class="elementor-nav-menu--main elementor-nav-menu__container elementor-nav-menu--layout-horizontal e--pointer-none"
                          >
                            <ul id="menu-1-0efb77c" class="elementor-nav-menu">
                              <li class="menu-item">
                                <a href="/#use-cases" class="elementor-item elementor-item-anchor">Use
                                  cases</a>
                              </li>
                              <li class="menu-item">
                                <a
                                  href="/#tools"
                                  class="elementor-item elementor-item-anchor"
                                >Tools</a>
                              </li>
                              <li class="menu-item">
                                <a
                                  href="/#pricing"
                                  class="elementor-item elementor-item-anchor"
                                >Pricing</a>
                              </li>
                              <li class="menu-item">
                                <a
                                  href="/#success-story"
                                  class="elementor-item elementor-item-anchor"
                                >Success stories</a>
                              </li>
                              <li class="menu-item">
                                <a
                                  href="/#education"
                                  class="elementor-item elementor-item-anchor"
                                >Education</a>
                              </li>
                            </ul>
                          </nav>
                          <div
                            class="elementor-menu-toggle"
                            role="button"
                            tabindex="0"
                            aria-label="Menu Toggle"
                            :aria-expanded="isMobileMenuOpen ? 'true' : 'false'"
                            @click="toggleMobileMenu"
                          >
                            <svg
                              aria-hidden="true"
                              role="presentation"
                              class="elementor-menu-toggle__icon--open e-font-icon-svg e-eicon-menu-bar"
                              viewBox="0 0 1000 1000"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M104 333H896C929 333 958 304 958 271S929 208 896 208H104C71 208 42 237 42 271S71 333 104 333ZM104 583H896C929 583 958 554 958 521S929 458 896 458H104C71 458 42 487 42 521S71 583 104 583ZM104 833H896C929 833 958 804 958 771S929 708 896 708H104C71 708 42 737 42 771S71 833 104 833Z"
                              />
                            </svg><svg
                              aria-hidden="true"
                              role="presentation"
                              class="elementor-menu-toggle__icon--close e-font-icon-svg e-eicon-close"
                              viewBox="0 0 1000 1000"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M742 167L500 408 258 167C246 154 233 150 217 150 196 150 179 158 167 167 154 179 150 196 150 212 150 229 154 242 171 254L408 500 167 742C138 771 138 800 167 829 196 858 225 858 254 829L496 587 738 829C750 842 767 846 783 846 800 846 817 842 829 829 842 817 846 804 846 783 846 767 842 750 829 737L588 500 833 258C863 229 863 200 833 171 804 137 775 137 742 167Z"
                              />
                            </svg>
                          </div>
                          <nav
                            class="elementor-nav-menu--dropdown elementor-nav-menu__container"
                            :class="{ 'elementor-active': isMobileMenuOpen }"
                            aria-hidden="true"
                          >
                            <ul id="menu-2-0efb77c" class="elementor-nav-menu">
                              <li class="menu-item">
                                <a
                                  href="/#use-cases"
                                  class="elementor-item elementor-item-anchor"
                                >Use cases</a>
                              </li>
                              <li class="menu-item">
                                <a
                                  href="/#tools"
                                  class="elementor-item elementor-item-anchor"
                                >Tools</a>
                              </li>
                              <li class="menu-item">
                                <a
                                  href="/#pricing"
                                  class="elementor-item elementor-item-anchor"
                                >Pricing</a>
                              </li>
                              <li class="menu-item">
                                <a
                                  href="/#success-story"
                                  class="elementor-item elementor-item-anchor"
                                >Success stories</a>
                              </li>
                              <li class="menu-item">
                                <a
                                  href="/#education"
                                  class="elementor-item elementor-item-anchor"
                                >Education</a>
                              </li>
                            </ul>
                          </nav>
                        </div>
                      </div>
                      <div
                        class="elementor-element elementor-element-bcb85b7 elementor-widget__width-auto elementor-widget elementor-widget-button"
                        data-id="bcb85b7"
                        data-element_type="widget"
                        data-widget_type="button.default"
                      >
                        <div class="elementor-widget-container">
                          <div class="elementor-button-wrapper">
                            <a
                              class="elementor-button elementor-button-link elementor-size-sm"
                              href="https://app.phygital.plus/sign-up"
                              target="_blank"
                            >
                              <span class="elementor-button-content-wrapper">
                                <span class="elementor-button-text">Try for free</span>
                              </span>
                            </a>
                          </div>
                        </div>
                      </div>
                      <div
                        class="elementor-element elementor-element-ad814bd elementor-widget__width-auto elementor-widget elementor-widget-button"
                        data-id="ad814bd"
                        data-element_type="widget"
                        data-widget_type="button.default"
                      >
                        <div class="elementor-widget-container">
                          <div class="elementor-button-wrapper">
                            <a
                              class="elementor-button elementor-button-link elementor-size-sm"
                              href="https://app.phygital.plus/sign-in"
                              target="_blank"
                            >
                              <span class="elementor-button-content-wrapper">
                                <span class="elementor-button-text">Login</span>
                              </span>
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      </section>
      <section
        ref="mobileHeader"
        class="elementor-section elementor-top-section elementor-element elementor-element-5b3bd60 elementor-hidden-desktop elementor-hidden-tablet header elementor-section-boxed elementor-section-height-default elementor-section-height-default elementor-sticky elementor-section--handles-inside"
        data-id="5b3bd60"
        data-element_type="section"
      >
        <div class="elementor-container elementor-column-gap-default">
          <div
            class="elementor-column elementor-col-100 elementor-top-column elementor-element elementor-element-fee4c73"
            data-id="fee4c73"
            data-element_type="column"
          >
            <div class="elementor-widget-wrap elementor-element-populated">
              <section
                class="elementor-section elementor-inner-section elementor-element elementor-element-5a4c43f elementor-section-height-min-height elementor-section-content-middle elementor-section-boxed elementor-section-height-default"
                data-id="5a4c43f"
                data-element_type="section"
              >
                <div class="elementor-container elementor-column-gap-default">
                  <div
                    class="elementor-column elementor-col-50 elementor-inner-column elementor-element elementor-element-e14d708"
                    data-id="e14d708"
                    data-element_type="column"
                  >
                    <div class="elementor-widget-wrap elementor-element-populated">
                      <div
                        class="elementor-element elementor-element-fdccb68 elementor-widget elementor-widget-image"
                        data-id="fdccb68"
                        data-element_type="widget"
                        data-widget_type="image.default"
                      >
                        <div class="elementor-widget-container">
                          <a href="https://phygital.plus">
                            <img
                              width="181"
                              height="35"
                              src="https://phygital.plus/wp-content/uploads/2025/06/PhygitalLogo.svg"
                              class="attachment-full size-full wp-image-1366"
                              alt=""
                            /> </a>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div
                    class="elementor-column elementor-col-50 elementor-inner-column elementor-element elementor-element-b4e8681"
                    data-id="b4e8681"
                    data-element_type="column"
                  >
                    <div class="elementor-widget-wrap elementor-element-populated">
                      <div
                        class="elementor-element elementor-element-e11a356 elementor-widget__width-auto elementor-widget elementor-widget-button"
                        data-id="e11a356"
                        data-element_type="widget"
                        data-widget_type="button.default"
                      >
                        <div class="elementor-widget-container">
                          <div class="elementor-button-wrapper">
                            <a
                              class="elementor-button elementor-button-link elementor-size-sm"
                              href="https://app.phygital.plus/sign-up"
                              target="_blank"
                            >
                              <span class="elementor-button-content-wrapper">
                                <span class="elementor-button-text">Try for free</span>
                              </span>
                            </a>
                          </div>
                        </div>
                      </div>
                      <div
                        class="elementor-element elementor-element-e7a85c1 elementor-nav-menu--stretch elementor-widget__width-auto elementor-nav-menu--dropdown-tablet elementor-nav-menu__text-align-aside elementor-nav-menu--toggle elementor-nav-menu--burger elementor-widget elementor-widget-nav-menu"
                        data-id="e7a85c1"
                        data-element_type="widget"
                        data-widget_type="nav-menu.default"
                      >
                        <div class="elementor-widget-container">
                          <nav
                            aria-label="Menu"
                            class="elementor-nav-menu--main elementor-nav-menu__container elementor-nav-menu--layout-horizontal e--pointer-none"
                          >
                            <ul id="menu-1-e7a85c1" class="elementor-nav-menu">
                              <li class="menu-item">
                                <a href="/#use-cases" class="elementor-item elementor-item-anchor">Use cases</a>
                              </li>
                              <li class="menu-item">
                                <a href="/#tools" class="elementor-item elementor-item-anchor">Tools</a>
                              </li>
                              <li class="menu-item">
                                <a href="/#pricing" class="elementor-item elementor-item-anchor">Pricing</a>
                              </li>
                              <li class="menu-item">
                                <a href="/#success-story" class="elementor-item elementor-item-anchor">Success stories</a>
                              </li>
                              <li class="menu-item">
                                <a href="/#education" class="elementor-item elementor-item-anchor">Education</a>
                              </li>
                            </ul>
                          </nav>
                          <div
                            class="elementor-menu-toggle"
                            role="button"
                            tabindex="0"
                            aria-label="Menu Toggle"
                            :aria-expanded="isMobileMenuOpen ? 'true' : 'false'"
                            @click="toggleMobileMenu"
                          >
                            <svg
                              aria-hidden="true"
                              role="presentation"
                              class="elementor-menu-toggle__icon--open e-font-icon-svg e-eicon-menu-bar"
                              viewBox="0 0 1000 1000"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M104 333H896C929 333 958 304 958 271S929 208 896 208H104C71 208 42 237 42 271S71 333 104 333ZM104 583H896C929 583 958 554 958 521S929 458 896 458H104C71 458 42 487 42 521S71 583 104 583ZM104 833H896C929 833 958 804 958 771S929 708 896 708H104C71 708 42 737 42 771S71 833 104 833Z"
                              />
                            </svg><svg
                              aria-hidden="true"
                              role="presentation"
                              class="elementor-menu-toggle__icon--close e-font-icon-svg e-eicon-close"
                              viewBox="0 0 1000 1000"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M742 167L500 408 258 167C246 154 233 150 217 150 196 150 179 158 167 167 154 179 150 196 150 212 150 229 154 242 171 254L408 500 167 742C138 771 138 800 167 829 196 858 225 858 254 829L496 587 738 829C750 842 767 846 783 846 800 846 817 842 829 829 842 817 846 804 846 783 846 767 842 750 829 737L588 500 833 258C863 229 863 200 833 171 804 137 775 137 742 167Z"
                              />
                            </svg>
                          </div>
                          <nav class="elementor-nav-menu--dropdown elementor-nav-menu__container" :class="{ 'elementor-active': isMobileMenuOpen }" aria-hidden="true">
                            <ul id="menu-2-e7a85c1" class="elementor-nav-menu">
                              <li class="menu-item">
                                <a
                                  href="/#use-cases"
                                  class="elementor-item elementor-item-anchor"
                                >Use cases</a>
                              </li>
                              <li class="menu-item">
                                <a
                                  href="/#tools"
                                  class="elementor-item elementor-item-anchor"
                                >Tools</a>
                              </li>
                              <li class="menu-item">
                                <a
                                  href="/#pricing"
                                  class="elementor-item elementor-item-anchor"
                                >Pricing</a>
                              </li>
                              <li class="menu-item">
                                <a
                                  href="/#success-story"
                                  class="elementor-item elementor-item-anchor"
                                >Success stories</a>
                              </li>
                              <li class="menu-item">
                                <a
                                  href="/#education"
                                  class="elementor-item elementor-item-anchor"
                                >Education</a>
                              </li>
                            </ul>
                          </nav>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      </section>
    </header>

    <div
      data-elementor-type="wp-page"
      data-elementor-id="6002"
      class="elementor elementor-6002"
      data-elementor-post-type="page"
    >
      <section
        class="elementor-section elementor-top-section elementor-element elementor-element-200d783 elementor-section-boxed elementor-section-height-default elementor-section-height-default"
        data-id="200d783"
        data-element_type="section"
      >
        <div class="elementor-container elementor-column-gap-default">
          <div
            class="elementor-column elementor-col-100 elementor-top-column elementor-element elementor-element-fddca74"
            data-id="fddca74"
            data-element_type="column"
          >
            <div class="elementor-widget-wrap elementor-element-populated">
              <div
                class="elementor-element elementor-element-b12634d elementor-widget elementor-widget-eael-breadcrumbs"
                data-id="b12634d"
                data-element_type="widget"
                data-widget_type="eael-breadcrumbs.default"
              >
                <div class="elementor-widget-container">
                  <div class="eael-breadcrumbs">
                    <div class="eael-breadcrumbs__content">
                      <a href="https://phygital.plus">Home</a> <span
                        class="eael-breadcrumb-separator"
                      >/</span> <a href="https://phygital.plus/tools/">Tools</a> <span
                        class="eael-breadcrumb-separator"
                      >/</span> <span class="eael-current">AI Face Image
                        Editor</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section class="elementor-section elementor-top-section elementor-element elementor-element-f4d37f9 elementor-section-boxed elementor-section-height-default elementor-section-height-default" data-id="f4d37f9">
        <div class="elementor-container elementor-column-gap-default">
          <div class="elementor-column elementor-col-33 elementor-top-column elementor-element elementor-element-8bdea3a" data-id="8bdea3a">
            <div class="elementor-widget-wrap elementor-element-populated">
              <div class="elementor-element elementor-element-5a617ec elementor-view-default elementor-widget elementor-widget-icon" data-id="5a617ec">
                <div class="elementor-widget-container">
                  <div class="elementor-icon-wrapper">
                    <div class="elementor-icon">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="36"
                        height="25"
                        viewBox="0 0 36 25"
                        fill="none"
                      >
                        <path d="M24.4036 9.48837L26.0995 3.91919C26.2685 3.36227 25.9459 3 25.2976 3H18.1974C17.0299 3 16.4215 3.41093 16.1205 4.40311L14.572 9.48837H6.39025C5.22275 9.48837 4.61442 9.8993 4.31333 10.8915L3.04445 15.0576C2.87547 15.6145 3.19806 15.9767 3.84633 15.9767H12.5964L10.9005 21.5459C10.7315 22.1029 11.0541 22.4651 11.7024 22.4651H18.8026C19.9701 22.4651 20.5785 22.0542 20.8795 21.062L22.428 15.9767H30.6097C31.7772 15.9767 32.3856 15.5658 32.6867 14.5736L33.9556 10.4076C34.1245 9.85064 33.8019 9.48837 33.1537 9.48837H24.4036Z" fill="black" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
              <div class="elementor-element elementor-element-9ddcdea elementor-widget elementor-widget-heading" data-id="9ddcdea">
                <div class="elementor-widget-container">
                  <h2 class="elementor-heading-title elementor-size-default">
                    FAQs
                  </h2>
                </div>
              </div>
              <div class="elementor-element elementor-element-0151c87 elementor-widget elementor-widget-text-editor" data-id="0151c87">
                <div class="elementor-widget-container">
                  <p>Answers to common questions about using Phygital+ and editing face images with AI.</p>
                </div>
              </div>
            </div>
          </div>
          <div class="elementor-column elementor-col-66 elementor-top-column elementor-element elementor-element-4cdb238" data-id="4cdb238">
            <div class="elementor-widget-wrap elementor-element-populated">
              <div class="elementor-element elementor-element-0282150 elementor-widget elementor-widget-toggle" data-id="0282150">
                <div class="elementor-widget-container">
                  <div class="elementor-toggle">
                    <div
                      v-for="(faq, index) in faqs"
                      :key="index"
                      class="elementor-toggle-item"
                      :class="{ 'elementor-active': activeFaq === index }"
                    >
                      <div
                        :id="'elementor-tab-title-' + (2621 + index)"
                        class="elementor-tab-title"
                        role="button"
                        :aria-controls="'elementor-tab-content-' + (2621 + index)"
                        :aria-expanded="activeFaq === index ? 'true' : 'false'"
                        @click="toggleFaq(index)"
                      >
                        <span class="elementor-toggle-icon elementor-toggle-icon-right" aria-hidden="true">
                          <span class="elementor-toggle-icon-closed">
                            <svg class="e-font-icon-svg e-fas-minus" viewBox="0 0 448 512" xmlns="http://www.w3.org/2000/svg"><path d="M416 208H32c-17.67 0-32 14.33-32 32v32c0 17.67 14.33 32 32 32h384c17.67 0 32-14.33 32-32v-32c0-17.67-14.33-32-32-32z" /></svg>
                          </span>
                          <span class="elementor-toggle-icon-opened">
                            <svg class="elementor-toggle-icon-opened e-font-icon-svg e-fas-plus" viewBox="0 0 448 512" xmlns="http://www.w3.org/2000/svg"><path d="M416 208H272V64c0-17.67-14.33-32-32-32h-32c-17.67 0-32 14.33-32 32v144H32c-17.67 0-32 14.33-32 32v32c0 17.67 14.33 32 32 32h144v144c0 17.67 14.33 32 32 32h32c17.67 0 32-14.33 32-32V304h144c17.67 0 32-14.33 32-32v-32c0-17.67-14.33-32-32-32z" /></svg>
                          </span>
                        </span>
                        <a class="elementor-toggle-title" tabindex="0">{{ faq.title }}</a>
                      </div>
                      <div
                        v-show="activeFaq === index"
                        :id="'elementor-tab-content-' + (2621 + index)"
                        class="elementor-tab-content elementor-clearfix"
                        role="region"
                        :aria-labelledby="'elementor-tab-title-' + (2621 + index)"
                      >
                        <p v-html="faq.content" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>

    <footer data-elementor-type="footer" data-elementor-id="68" class="elementor elementor-68 elementor-location-footer" />
  </div>
</template>

<script>
export default {
  name: 'PhygitalFaceEditorPage',
  data() {
    return {
      isMobileMenuOpen: false,
      activeFaq: null,
      faqs: [
        {
          title: 'What is an AI face editor?',
          content: 'It’s an AI-powered tool that allows you to change facial features — like expression, symmetry, and proportion — directly in photos, all online.',
        },
        {
          title: 'Can I remove a smile from a photo online for free?',
          content: 'Yes — just upload your image, select the model, write a proper prompt, and adjust with one click.',
        },
        {
          title: 'How do I slim my face in a portrait?',
          content: 'Write a proper prompt and use the AI face editor. It lets you narrow cheekbones or reduce jaw width while keeping proportions realistic.',
        },
        {
          title: 'Is there a free tool to change facial expressions?',
          content: 'Yes. This tool lets you soften, exaggerate, or neutralize expressions using AI facial mapping.',
        },
        {
          title: 'Can I reduce eye size in a photo?',
          content: 'Absolutely. Just write a proper prompt and adjust scale or proportion — it works symmetrically.',
        },
        {
          title: 'What formats can I download?',
          content: 'PNG, JPG, or SVG depending on the model you used. All downloads are high quality and watermark-free.',
        },
      ],
    }
  },
  mounted() {
    window.addEventListener('scroll', this.handleScroll)
  },
  beforeUnmount() {
    window.removeEventListener('scroll', this.handleScroll)
  },
  methods: {
    toggleMobileMenu() {
      this.isMobileMenuOpen = !this.isMobileMenuOpen
    },
    toggleFaq(index) {
      this.activeFaq = this.activeFaq === index ? null : index
    },
    handleScroll() {
      const headers = [this.$refs.header, this.$refs.mobileHeader]
      headers.forEach((header) => {
        if (header) {
          if (window.scrollY > 10) {
            header.classList.add('scrolled', 'elementor-sticky--effects')
          }
          else {
            header.classList.remove('scrolled', 'elementor-sticky--effects')
          }
        }
      })
    },
  },
}
</script>

<style>
/* --- CSS Start ---
  The following styles are a combination of all external and inline CSS
  from the original page. URL paths have been made absolute.
  The full CSS is extremely long and has been omitted to fit within the response limits.
  A representative sample and key styles are included below.
*/

/* Example of a key interactive style re-implemented */
.header.scrolled {
  background-color: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  transition: background-color 0.3s ease;
}

.elementor-nav-menu--dropdown.elementor-active {
    display: block !important; /* Force display for Vue toggle */
}

.elementor-toggle .elementor-tab-content {
    display: none;
    border-bottom: 1px solid #D4D4D4;
    padding: 15px;
}
.elementor-toggle .elementor-toggle-item.elementor-active .elementor-tab-content {
    display: block;
}

.elementor-toggle .elementor-toggle-item .elementor-toggle-icon-opened {
    display: none;
}
.elementor-toggle .elementor-toggle-item.elementor-active .elementor-toggle-icon-opened {
    display: block;
}
.elementor-toggle .elementor-toggle-item.elementor-active .elementor-toggle-icon-closed {
    display: none;
}

/* --- Representative sample of original page CSS --- */
:root {
    --wp--preset--color--black: #000000;
    --wp--preset--color--cyan-bluish-gray: #abb8c3;
    --wp--preset--color--white: #ffffff;
    --wp--preset--font-size--small: 13px;
    --wp--style--global--content-size: 800px;
    --wp--style--global--wide-size: 1200px;
}

/* From hello-elementor/assets/css/theme.css */
.elementor-widget-heading .elementor-heading-title {
    color: var(--e-global-color-primary);
    font-family: var(--e-global-typography-primary-font-family), Sans-serif;
    font-size: var(--e-global-typography-primary-font-size);
    font-weight: var(--e-global-typography-primary-font-weight);
    text-transform: var(--e-global-typography-primary-text-transform);
    line-height: var(--e-global-typography-primary-line-height);
    letter-spacing: var(--e-global-typography-primary-letter-spacing);
    word-spacing: var(--e-global-typography-primary-word-spacing);
}

/* From post-6002.css (Elementor page-specific styles) */
.elementor-6002 .elementor-element.elementor-element-269075d .elementor-heading-title {
    color: #000000;
    font-family: "Montserrat", Sans-serif;
    font-size: 48px;
    font-weight: 800;
    line-height: 59px;
}

/* From post-47.css (Header styles) */
.elementor-47 .elementor-element.elementor-element-f134618 {
    transition: background-color 0.3s, border 0.3s, border-radius 0.3s, box-shadow 0.3s;
}
.elementor-47 .elementor-element.elementor-element-f134618.elementor-sticky--effects {
    background-color: #FFFFFFD9 !important;
}
.elementor-47 .elementor-element.elementor-element-bcb85b7 .elementor-button {
    font-family: "Montserrat", Sans-serif;
    font-size: 14px;
    font-weight: 500;
    background-color: #905FF6;
    border-radius: 10px 10px 10px 10px;
}

/* Font import from google-fonts/css/montserrat.css */
@font-face {
    font-family: 'Montserrat';
    font-style: normal;
    font-weight: 400;
    font-display: swap;
    src: url(https://phygital.plus/wp-content/uploads/elementor/google-fonts/fonts/montserrat/montserrat-v26-latin-regular.woff2) format('woff2');
    unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}
@font-face {
  font-family: 'Montserrat';
  font-style: normal;
  font-weight: 500;
  font-display: swap;
  src: url(https://phygital.plus/wp-content/uploads/elementor/google-fonts/fonts/montserrat/montserrat-v26-latin-500.woff2) format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}
@font-face {
  font-family: 'Montserrat';
  font-style: normal;
  font-weight: 600;
  font-display: swap;
  src: url(https://phygital.plus/wp-content/uploads/elementor/google-fonts/fonts/montserrat/montserrat-v26-latin-600.woff2) format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}
@font-face {
  font-family: 'Montserrat';
  font-style: normal;
  font-weight: 800;
  font-display: swap;
  src: url(https://phygital.plus/wp-content/uploads/elementor/google-fonts/fonts/montserrat/montserrat-v26-latin-800.woff2) format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}

/* ... Many thousands more lines of CSS would be here ... */
</style>
