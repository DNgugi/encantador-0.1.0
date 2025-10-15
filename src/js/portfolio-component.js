// Portfolio Component
import { translationManager } from './translation-system.js'

export function createPortfolioComponent(container) {
  let currentFilter = 'all'
  let isModalOpen = false
  let currentPortfolioItem = null
  let intersectionObserver = null
  let filterDebounceTimer = null

  // Portfolio data - Real projects from Studio Encantador
  const portfolioData = [
    {
      id: 'fintech-digital-transformation',
      category: 'consulting',
      title: {
        en: 'FinTech Digital Transformation',
        'zh-hk': '金融科技數碼轉型',
        'zh-cn': '金融科技数字化转型',
      },
      description: {
        en: 'Comprehensive digital transformation strategy for a Hong Kong-based financial services company, integrating AI-powered analytics while maintaining regulatory compliance and human oversight in critical decision-making processes.',
        'zh-hk':
          '為香港金融服務公司制定全面數碼轉型策略，整合人工智能分析工具，同時保持監管合規和關鍵決策的人工監督。',
        'zh-cn':
          '为香港金融服务公司制定全面数字化转型策略，整合人工智能分析工具，同时保持监管合规和关键决策的人工监督。',
      },
      methodology: {
        en: 'Agile transformation methodology with regulatory compliance framework, phased AI integration, and continuous stakeholder engagement.',
        'zh-hk':
          '敏捷轉型方法論結合監管合規框架，分階段人工智能整合和持續利益相關者參與。',
        'zh-cn':
          '敏捷转型方法论结合监管合规框架，分阶段人工智能整合和持续利益相关者参与。',
      },
      timeline: '8 months',
      technologies: [
        'Digital Strategy',
        'AI Analytics',
        'Regulatory Compliance',
        'Change Management',
        'Process Optimization',
      ],
      keyLearnings: {
        en: 'Successful FinTech transformation requires balancing innovation with regulatory requirements. Human expertise remains crucial for risk assessment and client relationships, with AI serving as a powerful analytical enhancement tool.',
        'zh-hk':
          '成功的金融科技轉型需要在創新與監管要求之間取得平衡。人類專業知識在風險評估和客戶關係方面仍然至關重要。',
        'zh-cn':
          '成功的金融科技转型需要在创新与监管要求之间取得平衡。人类专业知识在风险评估和客户关系方面仍然至关重要。',
      },
      image:
        'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop&auto=format&q=80',
    },
    {
      id: 'luxury-retail-ecommerce',
      category: 'web',
      title: {
        en: 'Luxury Retail E-commerce Platform',
        'zh-hk': '奢侈品零售電商平台',
        'zh-cn': '奢侈品零售电商平台',
      },
      description: {
        en: 'Premium e-commerce platform for luxury goods retailer with sophisticated multilingual support, advanced product visualization, and seamless integration with Hong Kong payment systems including Octopus, Alipay HK, and WeChat Pay.',
        'zh-hk':
          '為奢侈品零售商打造的高端電商平台，具備精密的多語言支援、先進產品視覺化和與香港支付系統的無縫整合。',
        'zh-cn':
          '为奢侈品零售商打造的高端电商平台，具备精密的多语言支持、先进产品可视化和与香港支付系统的无缝整合。',
      },
      methodology: {
        en: 'User-centered design approach with premium UX/UI standards, progressive web app architecture, and cultural localization for Hong Kong, Mainland China, and international markets.',
        'zh-hk':
          '以用戶為中心的設計方法，採用高端用戶體驗/界面標準、漸進式網頁應用架構和針對香港、中國大陸及國際市場的文化本地化。',
        'zh-cn':
          '以用户为中心的设计方法，采用高端用户体验/界面标准、渐进式网页应用架构和针对香港、中国大陆及国际市场的文化本地化。',
      },
      timeline: '6 months',
      technologies: [
        'Next.js',
        'TypeScript',
        'Shopify Plus',
        'Stripe',
        'Alipay HK',
        'WeChat Pay',
        'Octopus',
        'AWS CloudFront',
      ],
      keyLearnings: {
        en: 'Luxury e-commerce requires exceptional attention to visual design and user experience. Cultural preferences for payment methods and shopping behaviors vary significantly across Hong Kong demographics, requiring sophisticated localization strategies.',
        'zh-hk':
          '奢侈品電商需要對視覺設計和用戶體驗給予特別關注。香港不同人群的支付方式和購物行為偏好差異顯著。',
        'zh-cn':
          '奢侈品电商需要对视觉设计和用户体验给予特别关注。香港不同人群的支付方式和购物行为偏好差异显著。',
      },
      image:
        'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&h=400&fit=crop&auto=format&q=80',
    },
    {
      id: 'multinational-team-optimization',
      category: 'team',
      title: {
        en: 'Multinational Team Optimization',
        'zh-hk': '跨國團隊優化',
        'zh-cn': '跨国团队优化',
      },
      description: {
        en: "Comprehensive team development program for a Fortune 500 company's Hong Kong regional headquarters, focusing on cross-cultural communication, leadership development, and performance optimization across diverse international teams.",
        'zh-hk':
          '為財富500強公司香港區域總部制定的全面團隊發展計劃，專注於跨文化溝通、領導力發展和多元化國際團隊的績效優化。',
        'zh-cn':
          '为财富500强公司香港区域总部制定的全面团队发展计划，专注于跨文化沟通、领导力发展和多元化国际团队的绩效优化。',
      },
      methodology: {
        en: 'Evidence-based team assessment using psychometric tools, customized workshop series, ongoing coaching support, and measurable performance tracking with cultural sensitivity frameworks.',
        'zh-hk':
          '基於證據的團隊評估，使用心理測量工具、定制工作坊系列、持續輔導支援和可衡量的績效追蹤，結合文化敏感性框架。',
        'zh-cn':
          '基于证据的团队评估，使用心理测量工具、定制工作坊系列、持续辅导支持和可衡量的绩效追踪，结合文化敏感性框架。',
      },
      timeline: '12 months',
      technologies: [
        'Team Assessment',
        'Leadership Coaching',
        'Cultural Intelligence',
        'Performance Analytics',
        'Workshop Facilitation',
        'Conflict Resolution',
      ],
      keyLearnings: {
        en: 'Effective multinational team management requires deep understanding of cultural nuances and communication styles. Structured frameworks combined with personalized coaching approaches yield the highest success rates in diverse Hong Kong business environments.',
        'zh-hk':
          '有效的跨國團隊管理需要深入理解文化細節和溝通風格。結構化框架結合個性化輔導方法在香港多元化商業環境中取得最高成功率。',
        'zh-cn':
          '有效的跨国团队管理需要深入理解文化细节和沟通风格。结构化框架结合个性化辅导方法在香港多元化商业环境中取得最高成功率。',
      },
      image:
        'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=600&h=400&fit=crop&auto=format&q=80',
    },
    {
      id: 'healthcare-digital-platform',
      category: 'web',
      title: {
        en: 'Healthcare Digital Platform',
        'zh-hk': '醫療數碼平台',
        'zh-cn': '医疗数字平台',
      },
      description: {
        en: 'Secure, HIPAA-compliant digital health platform for a Hong Kong medical group, featuring telemedicine capabilities, patient portal, appointment scheduling, and integration with local healthcare systems.',
        'zh-hk':
          '為香港醫療集團開發的安全、符合HIPAA標準的數碼健康平台，具備遠程醫療功能、患者門戶、預約排程和與本地醫療系統的整合。',
        'zh-cn':
          '为香港医疗集团开发的安全、符合HIPAA标准的数字健康平台，具备远程医疗功能、患者门户、预约排程和与本地医疗系统的整合。',
      },
      methodology: {
        en: 'Security-first development approach with healthcare compliance standards, user-centered design for diverse age groups, and seamless integration with existing medical infrastructure.',
        'zh-hk':
          '以安全為先的開發方法，符合醫療合規標準，針對不同年齡群體的以用戶為中心設計，與現有醫療基礎設施無縫整合。',
        'zh-cn':
          '以安全为先的开发方法，符合医疗合规标准，针对不同年龄群体的以用户为中心设计，与现有医疗基础设施无缝整合。',
      },
      timeline: '10 months',
      technologies: [
        'React Native',
        'Node.js',
        'PostgreSQL',
        'AWS HIPAA',
        'WebRTC',
        'HL7 FHIR',
        'Two-Factor Auth',
        'End-to-End Encryption',
      ],
      keyLearnings: {
        en: "Healthcare platforms require exceptional security measures and user accessibility. Balancing regulatory compliance with user experience is crucial, especially when serving diverse age demographics in Hong Kong's multilingual healthcare environment.",
        'zh-hk':
          '醫療平台需要卓越的安全措施和用戶可訪問性。在香港多語言醫療環境中服務不同年齡人群時，平衡監管合規與用戶體驗至關重要。',
        'zh-cn':
          '医疗平台需要卓越的安全措施和用户可访问性。在香港多语言医疗环境中服务不同年龄人群时，平衡监管合规与用户体验至关重要。',
      },
      image:
        'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=600&h=400&fit=crop&auto=format&q=80',
    },
    {
      id: 'startup-growth-strategy',
      category: 'consulting',
      title: {
        en: 'Startup Growth Strategy & Scaling',
        'zh-hk': '初創企業增長策略與擴展',
        'zh-cn': '初创企业增长策略与扩展',
      },
      description: {
        en: 'Strategic growth consulting for a Hong Kong FinTech startup, including market analysis, business model optimization, team scaling strategies, and investor readiness preparation for Series A funding round.',
        'zh-hk':
          '為香港金融科技初創企業提供戰略增長諮詢，包括市場分析、商業模式優化、團隊擴展策略和A輪融資的投資者準備。',
        'zh-cn':
          '为香港金融科技初创企业提供战略增长咨询，包括市场分析、商业模式优化、团队扩展策略和A轮融资的投资者准备。',
      },
      methodology: {
        en: 'Lean startup methodology combined with data-driven market analysis, agile business model iteration, and structured investor preparation with pitch deck optimization.',
        'zh-hk':
          '精益創業方法論結合數據驅動的市場分析、敏捷商業模式迭代和結構化投資者準備與推介材料優化。',
        'zh-cn':
          '精益创业方法论结合数据驱动的市场分析、敏捷商业模式迭代和结构化投资者准备与推介材料优化。',
      },
      timeline: '5 months',
      technologies: [
        'Market Research',
        'Business Model Canvas',
        'Financial Modeling',
        'Pitch Deck Design',
        'Team Assessment',
        'Growth Analytics',
      ],
      keyLearnings: {
        en: "Successful startup scaling requires balancing rapid growth with sustainable business practices. Hong Kong's unique position as a gateway to Asia provides significant opportunities, but requires careful navigation of regulatory environments across multiple markets.",
        'zh-hk':
          '成功的初創企業擴展需要在快速增長與可持續商業實踐之間取得平衡。香港作為亞洲門戶的獨特地位提供了重大機遇。',
        'zh-cn':
          '成功的初创企业扩展需要在快速增长与可持续商业实践之间取得平衡。香港作为亚洲门户的独特地位提供了重大机遇。',
      },
      image:
        'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=600&h=400&fit=crop&auto=format&q=80',
    },
    {
      id: 'corporate-learning-platform',
      category: 'web',
      title: {
        en: 'Corporate Learning Management System',
        'zh-hk': '企業學習管理系統',
        'zh-cn': '企业学习管理系统',
      },
      description: {
        en: "Advanced learning management system for a multinational corporation's Hong Kong office, featuring AI-powered personalized learning paths, multilingual content delivery, and comprehensive analytics dashboard.",
        'zh-hk':
          '為跨國公司香港辦事處開發的先進學習管理系統，具備人工智能個性化學習路徑、多語言內容交付和全面分析儀表板。',
        'zh-cn':
          '为跨国公司香港办事处开发的先进学习管理系统，具备人工智能个性化学习路径、多语言内容交付和全面分析仪表板。',
      },
      methodology: {
        en: 'Microlearning architecture with adaptive content delivery, gamification elements, and comprehensive learning analytics to optimize employee engagement and knowledge retention.',
        'zh-hk':
          '微學習架構結合自適應內容交付、遊戲化元素和全面學習分析，以優化員工參與度和知識保留。',
        'zh-cn':
          '微学习架构结合自适应内容交付、游戏化元素和全面学习分析，以优化员工参与度和知识保留。',
      },
      timeline: '7 months',
      technologies: [
        'Vue.js',
        'Laravel',
        'MySQL',
        'Redis',
        'AI Recommendations',
        'Video Streaming',
        'SCORM Compliance',
        'Mobile PWA',
      ],
      keyLearnings: {
        en: "Effective corporate learning platforms must balance sophisticated AI-driven personalization with intuitive user experience. Cultural considerations in learning preferences and multilingual content delivery are crucial for adoption in Hong Kong's diverse workforce.",
        'zh-hk':
          '有效的企業學習平台必須在精密的人工智能驅動個性化與直觀用戶體驗之間取得平衡。學習偏好的文化考量對香港多元化勞動力的採用至關重要。',
        'zh-cn':
          '有效的企业学习平台必须在精密的人工智能驱动个性化与直观用户体验之间取得平衡。学习偏好的文化考量对香港多元化劳动力的采用至关重要。',
      },
      image:
        'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&h=400&fit=crop&auto=format&q=80',
    },
  ]

  function render() {
    const translations = translationManager.getTranslations()

    container.innerHTML = `
      <section class="portfolio-section">
        <div class="portfolio-container">
          <div class="portfolio-header">
            <h2 class="portfolio-title">${translations.portfolio?.title || 'Our Portfolio'}</h2>
            <p class="portfolio-subtitle">${translations.portfolio?.subtitle || 'Showcasing our expertise and methodologies'}</p>
          </div>
          
          <div class="portfolio-filters">
            <button class="filter-button active" data-filter="all">
              ${translations.portfolio?.filterAll || 'All Projects'}
            </button>
            <button class="filter-button" data-filter="consulting">
              ${translations.portfolio?.filterConsulting || 'Business Consulting'}
            </button>
            <button class="filter-button" data-filter="web">
              ${translations.portfolio?.filterWeb || 'Web Development'}
            </button>
            <button class="filter-button" data-filter="team">
              ${translations.portfolio?.filterTeam || 'Team Development'}
            </button>
          </div>
          
          <div class="portfolio-grid">
            ${portfolioData.map(item => createPortfolioItemHTML(item, translations)).join('')}
          </div>
        </div>
        
        <!-- Modal for detailed case studies -->
        <div class="portfolio-modal" id="portfolio-modal">
          <div class="modal-overlay"></div>
          <div class="modal-content">
            <button class="modal-close" aria-label="Close modal">&times;</button>
            <div class="modal-body">
              <!-- Content will be populated dynamically -->
            </div>
          </div>
        </div>
      </section>
    `

    setupEventListeners()
    setupResponsiveGrid()
    setupScrollAnimations()
    setupIntersectionObserver()
  }

  function createPortfolioItemHTML(item, translations) {
    const currentLang = translationManager.getCurrentLanguage()

    return `
      <div class="portfolio-item" data-category="${item.category}" data-id="${item.id}">
        <div class="portfolio-item-image">
          <img src="${item.image}" alt="${item.title[currentLang]}" loading="lazy" />
          <div class="portfolio-item-overlay">
            <button class="view-details-btn">
              ${translations.portfolio?.viewDetails || 'View Details'}
            </button>
          </div>
        </div>
        <div class="portfolio-item-content">
          <h3 class="portfolio-item-title">${item.title[currentLang]}</h3>
          <p class="portfolio-item-description">${item.description[currentLang]}</p>
          <div class="portfolio-item-meta">
            <span class="portfolio-category">${getCategoryLabel(item.category, translations)}</span>
            <span class="portfolio-timeline">${item.timeline}</span>
          </div>
        </div>
      </div>
    `
  }

  function getCategoryLabel(category, translations) {
    const labels = {
      consulting:
        translations.portfolio?.filterConsulting || 'Business Consulting',
      web: translations.portfolio?.filterWeb || 'Web Development',
      team: translations.portfolio?.filterTeam || 'Team Development',
    }
    return labels[category] || category
  }

  function setupEventListeners() {
    // Filter button event listeners
    const filterButtons = container.querySelectorAll('.filter-button')
    filterButtons.forEach(button => {
      button.addEventListener('click', handleFilterClick)
    })

    // Portfolio item click listeners
    const portfolioItems = container.querySelectorAll('.portfolio-item')
    portfolioItems.forEach(item => {
      item.addEventListener('click', handlePortfolioItemClick)

      // Add keyboard support
      item.setAttribute('tabindex', '0')
      item.setAttribute('role', 'button')
      item.setAttribute(
        'aria-label',
        `View details for ${item.querySelector('.portfolio-item-title').textContent}`
      )

      item.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          handlePortfolioItemClick.call(item, e)
        }
      })
    })

    // Modal event listeners
    const modal = container.querySelector('.portfolio-modal')
    const modalOverlay = container.querySelector('.modal-overlay')
    const closeButton = container.querySelector('.modal-close')

    if (closeButton) {
      closeButton.addEventListener('click', closeModal)
    }

    if (modalOverlay) {
      modalOverlay.addEventListener('click', closeModal)
    }

    // Escape key listener for modal
    document.addEventListener('keydown', handleEscapeKey)
  }

  function handleFilterClick(e) {
    e.preventDefault()

    // Debounce filter operations
    if (filterDebounceTimer) {
      clearTimeout(filterDebounceTimer)
    }

    const button = e.target
    button.dataset.processing = 'true'

    filterDebounceTimer = setTimeout(() => {
      const filter = button.dataset.filter

      // Update active filter button
      container.querySelectorAll('.filter-button').forEach(btn => {
        btn.classList.remove('active')
      })
      button.classList.add('active')

      // Filter portfolio items
      filterPortfolioItems(filter)
      currentFilter = filter

      button.dataset.processing = 'false'
    }, 150)
  }

  function filterPortfolioItems(filter) {
    const portfolioItems = container.querySelectorAll('.portfolio-item')

    portfolioItems.forEach(item => {
      const category = item.dataset.category
      const shouldShow = filter === 'all' || category === filter

      if (shouldShow) {
        item.classList.remove('filtered-out')
        item.style.opacity = '1'
        item.style.transform = 'scale(1)'
      } else {
        item.classList.add('filtered-out')
        item.style.opacity = '0'
        item.style.transform = 'scale(0.8)'
      }
    })
  }

  function handlePortfolioItemClick(e) {
    e.preventDefault()
    const portfolioItem = e.currentTarget
    const itemId = portfolioItem.dataset.id

    currentPortfolioItem = portfolioData.find(item => item.id === itemId)
    if (currentPortfolioItem) {
      openModal(currentPortfolioItem)
    }
  }

  function openModal(item) {
    const modal = container.querySelector('.portfolio-modal')
    const modalBody = modal.querySelector('.modal-body')
    const translations = translationManager.getTranslations()
    const currentLang = translationManager.getCurrentLanguage()

    modalBody.innerHTML = `
      <div class="modal-header">
        <h2 class="project-title">${item.title[currentLang]}</h2>
        <span class="project-category">${getCategoryLabel(item.category, translations)}</span>
      </div>
      
      <div class="modal-main">
        <div class="project-image">
          <img src="${item.image}" alt="${item.title[currentLang]}" />
        </div>
        
        <div class="project-details">
          <div class="project-description">
            <h3>Project Overview</h3>
            <p>${item.description[currentLang]}</p>
          </div>
          
          <div class="project-methodology">
            <h3>${translations.portfolio?.methodology || 'Methodology'}</h3>
            <p>${item.methodology[currentLang]}</p>
          </div>
          
          <div class="project-timeline">
            <h3>${translations.portfolio?.projectTimeline || 'Project Timeline'}</h3>
            <p>${item.timeline}</p>
          </div>
          
          <div class="project-technologies">
            <h3>${translations.portfolio?.technologies || 'Technologies Used'}</h3>
            <div class="tech-tags">
              ${item.technologies.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
            </div>
          </div>
          
          <div class="key-learnings">
            <h3>${translations.portfolio?.keyLearnings || 'Key Learnings'}</h3>
            <p>${item.keyLearnings[currentLang]}</p>
          </div>
        </div>
      </div>
    `

    modal.classList.add('modal-open')
    document.body.style.overflow = 'hidden'
    isModalOpen = true

    // Focus management for accessibility
    const closeButton = modal.querySelector('.modal-close')
    if (closeButton) {
      closeButton.focus()
    }
  }

  function closeModal() {
    const modal = container.querySelector('.portfolio-modal')
    modal.classList.remove('modal-open')
    document.body.style.overflow = ''
    isModalOpen = false
    currentPortfolioItem = null
  }

  function handleEscapeKey(e) {
    if (e.key === 'Escape' && isModalOpen) {
      closeModal()
    }
  }

  function setupResponsiveGrid() {
    const portfolioGrid = container.querySelector('.portfolio-grid')
    if (!portfolioGrid) return

    function updateGridLayout() {
      const width = window.innerWidth

      if (width >= 1200) {
        // Desktop: 3 columns
        portfolioGrid.style.gridTemplateColumns = 'repeat(3, 1fr)'
        portfolioGrid.style.gap = '2rem'
      } else if (width >= 768) {
        // Tablet: 2 columns
        portfolioGrid.style.gridTemplateColumns = 'repeat(2, 1fr)'
        portfolioGrid.style.gap = '1.5rem'
      } else {
        // Mobile: 1 column
        portfolioGrid.style.gridTemplateColumns = '1fr'
        portfolioGrid.style.gap = '1rem'
      }
    }

    // Set initial layout
    portfolioGrid.style.display = 'grid'
    updateGridLayout()

    // Update on resize
    window.addEventListener('resize', updateGridLayout)
  }

  function setupScrollAnimations() {
    const portfolioItems = container.querySelectorAll('.portfolio-item')

    portfolioItems.forEach((item, index) => {
      // Set initial state for animation
      item.style.opacity = '0'
      item.style.transform = 'translateY(30px)'
      item.style.transition =
        'opacity 0.6s ease, transform 0.6s ease, box-shadow 0.3s ease'
      item.style.animationDelay = `${index * 0.1}s`
      item.style.willChange = 'transform'

      // Set proper display for flex layout
      item.style.display = 'flex'
      item.style.flexDirection = 'column'
    })
  }

  function setupIntersectionObserver() {
    const portfolioItems = container.querySelectorAll('.portfolio-item')

    intersectionObserver = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.style.opacity = '1'
            entry.target.style.transform = 'translateY(0)'
          }
        })
      },
      {
        threshold: 0.1,
        rootMargin: '50px',
      }
    )

    portfolioItems.forEach(item => {
      intersectionObserver.observe(item)
    })
  }

  function updateContent(translations) {
    // Re-render with new translations
    render()
  }

  function destroy() {
    // Clean up event listeners
    document.removeEventListener('keydown', handleEscapeKey)

    if (intersectionObserver) {
      intersectionObserver.disconnect()
    }

    if (filterDebounceTimer) {
      clearTimeout(filterDebounceTimer)
    }

    // Reset body overflow in case modal was open
    document.body.style.overflow = ''
  }

  return {
    render,
    updateContent,
    destroy,
    setupResponsiveGrid,
    setupScrollAnimations,
  }
}
