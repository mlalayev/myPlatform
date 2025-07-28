"use client";

import React, { useState } from "react";
import {
  FiShield,
  FiLock,
  FiKey,
  FiSmartphone,
  FiMail,
  FiEye,
  FiEyeOff,
  FiCheck,
  FiX,
  FiAlertTriangle,
  FiSettings,
  FiUser,
  FiGlobe,
  FiBell,
  FiDownload,
  FiRefreshCw,
  FiClock,
  FiMapPin,
  FiMonitor,
  FiDatabase,
  FiWifi,
  FiWifiOff,
} from "react-icons/fi";
import { useI18n } from "../../../../contexts/I18nContext";
import securityStyles from "../ProfileSecurity.module.css";

interface ProfileSecurityProps {
  userStats: any;
  loading: boolean;
}

export default function ProfileSecurity({
  userStats,
  loading,
}: ProfileSecurityProps) {
  const { t } = useI18n();
  const [showPassword, setShowPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("test123");
  const [confirmPassword, setConfirmPassword] = useState("");

  if (loading) {
    return (
      <div className={securityStyles.securityContainer}>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ 
              width: '40px', 
              height: '40px', 
              border: '4px solid #f3f3f3', 
              borderTop: '4px solid #667eea', 
              borderRadius: '50%', 
              animation: 'spin 1s linear infinite',
              margin: '0 auto 16px'
            }}></div>
            <span style={{ color: '#718096' }}>{t("security.loading")}</span>
          </div>
        </div>
      </div>
    );
  }

  // Security score calculation
  const securityScore = 85; // 0-100
  const scorePercentage = (securityScore / 100) * 360; // Convert to degrees

  // Authentication methods data
  const authMethods = [
    {
      id: "email",
      name: t("security.authentication.methods.email.name"),
      description: t("security.authentication.methods.email.description"),
      icon: <FiMail />,
      status: "enabled",
      lastUsed: "2 hours ago",
      device: "Chrome on Windows"
    },
    {
      id: "google",
      name: t("security.authentication.methods.google.name"),
      description: t("security.authentication.methods.google.description"),
      icon: <FiGlobe />,
      status: "enabled",
      lastUsed: "1 day ago",
      device: "Safari on iPhone"
    },
    {
      id: "phone",
      name: t("security.authentication.methods.phone.name"),
      description: t("security.authentication.methods.phone.description"),
      icon: <FiSmartphone />,
      status: "enabled",
      lastUsed: "3 days ago",
      device: "SMS verification"
    },
    {
      id: "backup",
      name: t("security.authentication.methods.backup.name"),
      description: t("security.authentication.methods.backup.description"),
      icon: <FiKey />,
      status: "disabled",
      lastUsed: "Never used",
      device: "Emergency access"
    }
  ];

  // Privacy settings data
  const privacySettings = [
    {
      id: "profile_visibility",
      title: t("security.privacy.settings.profileVisibility.title"),
      description: t("security.privacy.settings.profileVisibility.description"),
      enabled: true
    },
    {
      id: "activity_sharing",
      title: t("security.privacy.settings.activitySharing.title"),
      description: t("security.privacy.settings.activitySharing.description"),
      enabled: false
    },
    {
      id: "email_notifications",
      title: t("security.privacy.settings.emailNotifications.title"),
      description: t("security.privacy.settings.emailNotifications.description"),
      enabled: true
    },
    {
      id: "data_collection",
      title: t("security.privacy.settings.dataCollection.title"),
      description: t("security.privacy.settings.dataCollection.description"),
      enabled: true
    },
    {
      id: "location_sharing",
      title: t("security.privacy.settings.locationSharing.title"),
      description: t("security.privacy.settings.locationSharing.description"),
      enabled: false
    }
  ];

  // Security log data
  const securityLog = [
    {
      id: 1,
      type: "login",
      action: t("security.activity.events.login"),
      info: t("security.activity.devices.chrome"),
      time: `2 ${t("security.activity.times.hoursAgo")}`,
      location: t("security.activity.locations.baku"),
      icon: <FiUser />
    },
    {
      id: 2,
      type: "password",
      action: t("security.activity.events.passwordChange"),
      info: t("security.activity.events.passwordChange"),
      time: `1 ${t("security.activity.times.daysAgo")}`,
      location: t("security.activity.locations.baku"),
      icon: <FiLock />
    },
    {
      id: 3,
      type: "login",
      action: t("security.activity.events.login"),
      info: t("security.activity.devices.safari"),
      time: `3 ${t("security.activity.times.daysAgo")}`,
      location: t("security.activity.locations.baku"),
      icon: <FiUser />
    },
    {
      id: 4,
      type: "suspicious",
      action: t("security.activity.events.failedLogin"),
      info: t("security.activity.devices.unknown"),
      time: `1 ${t("security.activity.times.weeksAgo")}`,
      location: t("security.activity.locations.moscow"),
      icon: <FiAlertTriangle />
    },
    {
      id: 5,
      type: "logout",
      action: t("security.activity.events.logout"),
      info: t("security.activity.events.logout"),
      time: `1 ${t("security.activity.times.weeksAgo")}`,
      location: t("security.activity.locations.baku"),
      icon: <FiClock />
    }
  ];

  // Password strength calculation
  const calculatePasswordStrength = (password: string) => {
    let score = 0;
    const requirements = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      numbers: /\d/.test(password),
      symbols: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    };

    if (requirements.length) score += 20;
    if (requirements.uppercase) score += 20;
    if (requirements.lowercase) score += 20;
    if (requirements.numbers) score += 20;
    if (requirements.symbols) score += 20;

    if (score <= 20) return { strength: "weak", score, requirements };
    if (score <= 40) return { strength: "medium", score, requirements };
    if (score <= 60) return { strength: "strong", score, requirements };
    return { strength: "veryStrong", score, requirements };
  };

  const passwordStrength = calculatePasswordStrength(newPassword);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'enabled':
        return <FiCheck />;
      case 'disabled':
        return <FiX />;
      case 'warning':
        return <FiAlertTriangle />;
      default:
        return <FiSettings />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'enabled':
        return securityStyles.enabled;
      case 'disabled':
        return securityStyles.disabled;
      case 'warning':
        return securityStyles.warning;
      default:
        return securityStyles.disabled;
    }
  };

  return (
    <div className={securityStyles.securityContainer}>
      {/* Hero Section */}
      <div className={securityStyles.securityHero}>
        <div className={securityStyles.heroContent}>
          <div className={securityStyles.heroLeft}>
            <h1 className={securityStyles.heroTitle}>{t("security.hero.title")}</h1>
            <p className={securityStyles.heroSubtitle}>
              {t("security.hero.subtitle")}
            </p>
            <div className={securityStyles.heroActions}>
              <button className={`${securityStyles.heroButton} ${securityStyles.primary}`}>
                <FiShield />
                {t("security.hero.actions.securityCheck")}
              </button>
              <button className={securityStyles.heroButton}>
                <FiDownload />
                {t("security.hero.actions.exportData")}
              </button>
              <button className={securityStyles.heroButton}>
                <FiRefreshCw />
                {t("security.hero.actions.refreshLogs")}
              </button>
            </div>
          </div>
          <div className={securityStyles.heroRight}>
            <div className={securityStyles.securityStats}>
              <div className={securityStyles.statItem}>
                <span className={securityStyles.statNumber}>
                  {securityScore}%
                </span>
                <span className={securityStyles.statLabel}>
                  {t("security.stats.securityScore")}
                </span>
              </div>
              <div className={securityStyles.statItem}>
                <span className={securityStyles.statNumber}>
                  {authMethods.filter(m => m.status === 'enabled').length}
                </span>
                <span className={securityStyles.statLabel}>
                  {t("security.stats.activeMethods")}
                </span>
              </div>
              <div className={securityStyles.statItem}>
                <span className={securityStyles.statNumber}>
                  {securityLog.length}
                </span>
                <span className={securityStyles.statLabel}>
                  {t("security.stats.recentActivities")}
                </span>
              </div>
              <div className={securityStyles.statItem}>
                <span className={securityStyles.statNumber}>
                  {privacySettings.filter(s => s.enabled).length}
                </span>
                <span className={securityStyles.statLabel}>
                  {t("security.stats.privacySettings")}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Security Overview */}
      <div className={securityStyles.securityOverview}>
        <div className={securityStyles.overviewHeader}>
          <h3 className={securityStyles.overviewTitle}>{t("security.overview.title")}</h3>
        </div>
        
        <div className={securityStyles.securityScore}>
          <div 
            className={securityStyles.scoreCircle}
            style={{
              background: `conic-gradient(#48bb78 0deg ${scorePercentage}deg, #e2e8f0 ${scorePercentage}deg 360deg)`
            }}
          >
            <div className={securityStyles.scoreNumber}>
              {securityScore}
            </div>
          </div>
          <div className={securityStyles.scoreInfo}>
            <h4 className={securityStyles.scoreLabel}>
              {securityScore >= 80 ? t("security.overview.excellent") :
               securityScore >= 60 ? t("security.overview.good") :
               securityScore >= 40 ? t("security.overview.fair") : t("security.overview.poor")}
            </h4>
            <p className={securityStyles.scoreDescription}>
              {t("security.overview.description")}
              {securityScore < 80 && ` ${t("security.overview.suggestion")}`}
            </p>
          </div>
        </div>

        <div className={securityStyles.securityGrid}>
          {/* Authentication Methods */}
          <div className={securityStyles.securitySection}>
            <div className={securityStyles.sectionHeader}>
              <h4 className={securityStyles.sectionTitle}>
                <div className={securityStyles.sectionIcon}>
                  <FiKey />
                </div>
                {t("security.authentication.title")}
              </h4>
              <div className={`${securityStyles.sectionStatus} ${getStatusColor('enabled')}`}>
                {getStatusIcon('enabled')}
                {t("security.authentication.status.secure")}
              </div>
            </div>
            
            <div className={securityStyles.authMethods}>
              {authMethods.map((method) => (
                <div key={method.id} className={securityStyles.authMethod}>
                  <div className={securityStyles.authMethodInfo}>
                    <div className={securityStyles.authMethodIcon}>
                      {method.icon}
                    </div>
                    <div className={securityStyles.authMethodDetails}>
                      <div className={securityStyles.authMethodName}>
                        {method.name}
                      </div>
                      <div className={securityStyles.authMethodDescription}>
                        {method.description} • {t("security.authentication.lastUsed")}: {method.lastUsed}
                      </div>
                    </div>
                  </div>
                  <div className={securityStyles.authMethodActions}>
                    {method.status === 'enabled' ? (
                      <>
                        <button className={`${securityStyles.authButton} ${securityStyles.secondary}`}>
                          {t("security.authentication.actions.edit")}
                        </button>
                        <button className={`${securityStyles.authButton} ${securityStyles.danger}`}>
                          {t("security.authentication.actions.remove")}
                        </button>
                      </>
                    ) : (
                      <button className={`${securityStyles.authButton} ${securityStyles.primary}`}>
                        {t("security.authentication.actions.enable")}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Password Settings */}
          <div className={securityStyles.securitySection}>
            <div className={securityStyles.sectionHeader}>
              <h4 className={securityStyles.sectionTitle}>
                <div className={securityStyles.sectionIcon}>
                  <FiLock />
                </div>
                {t("security.password.title")}
              </h4>
              <div className={`${securityStyles.sectionStatus} ${getStatusColor('enabled')}`}>
                {getStatusIcon('enabled')}
                {t("security.password.status.strong")}
              </div>
            </div>
            
            <div className={securityStyles.passwordSettings}>
              <div className={securityStyles.passwordStrength}>
                <span>{t("security.password.strength")}</span>
                <div className={securityStyles.strengthBar}>
                  <div 
                    className={`${securityStyles.strengthBarFill} ${securityStyles[passwordStrength.strength]}`}
                    style={{ width: `${passwordStrength.score}%` }}
                  ></div>
                </div>
                <span className={`${securityStyles.strengthLabel} ${securityStyles[passwordStrength.strength]}`}>
                  {t(`security.password.levels.${passwordStrength.strength}`)}
                </span>
              </div>

              <div className={securityStyles.passwordRequirements}>
                <div className={`${securityStyles.requirementItem} ${passwordStrength.requirements.length ? securityStyles.met : ''}`}>
                  <span className={securityStyles.requirementIcon}>
                    {passwordStrength.requirements.length ? <FiCheck /> : <FiX />}
                  </span>
                  {t("security.password.requirements.length")}
                </div>
                <div className={`${securityStyles.requirementItem} ${passwordStrength.requirements.uppercase ? securityStyles.met : ''}`}>
                  <span className={securityStyles.requirementIcon}>
                    {passwordStrength.requirements.uppercase ? <FiCheck /> : <FiX />}
                  </span>
                  {t("security.password.requirements.uppercase")}
                </div>
                <div className={`${securityStyles.requirementItem} ${passwordStrength.requirements.lowercase ? securityStyles.met : ''}`}>
                  <span className={securityStyles.requirementIcon}>
                    {passwordStrength.requirements.lowercase ? <FiCheck /> : <FiX />}
                  </span>
                  {t("security.password.requirements.lowercase")}
                </div>
                <div className={`${securityStyles.requirementItem} ${passwordStrength.requirements.numbers ? securityStyles.met : ''}`}>
                  <span className={securityStyles.requirementIcon}>
                    {passwordStrength.requirements.numbers ? <FiCheck /> : <FiX />}
                  </span>
                  {t("security.password.requirements.numbers")}
                </div>
                <div className={`${securityStyles.requirementItem} ${passwordStrength.requirements.symbols ? securityStyles.met : ''}`}>
                  <span className={securityStyles.requirementIcon}>
                    {passwordStrength.requirements.symbols ? <FiCheck /> : <FiX />}
                  </span>
                  {t("security.password.requirements.symbols")}
                </div>
              </div>
            </div>
          </div>

          {/* Privacy Settings */}
          <div className={securityStyles.securitySection}>
            <div className={securityStyles.sectionHeader}>
              <h4 className={securityStyles.sectionTitle}>
                <div className={securityStyles.sectionIcon}>
                  <FiUser />
                </div>
                {t("security.privacy.title")}
              </h4>
              <div className={`${securityStyles.sectionStatus} ${getStatusColor('enabled')}`}>
                {getStatusIcon('enabled')}
                {t("security.privacy.status.protected")}
              </div>
            </div>
            
            <div className={securityStyles.privacySettings}>
              {privacySettings.map((setting) => (
                <div key={setting.id} className={securityStyles.privacyOption}>
                  <div className={securityStyles.privacyInfo}>
                    <div className={securityStyles.privacyTitle}>
                      {setting.title}
                    </div>
                    <div className={securityStyles.privacyDescription}>
                      {setting.description}
                    </div>
                  </div>
                  <div 
                    className={`${securityStyles.toggleSwitch} ${setting.enabled ? securityStyles.enabled : ''}`}
                  ></div>
                </div>
              ))}
            </div>
          </div>

          {/* Security Log */}
          <div className={securityStyles.securitySection}>
            <div className={securityStyles.sectionHeader}>
              <h4 className={securityStyles.sectionTitle}>
                <div className={securityStyles.sectionIcon}>
                  <FiMonitor />
                </div>
                {t("security.activity.title")}
              </h4>
              <div className={`${securityStyles.sectionStatus} ${getStatusColor('enabled')}`}>
                {getStatusIcon('enabled')}
                {t("security.activity.status.active")}
              </div>
            </div>
            
            <div className={securityStyles.securityLog}>
              {securityLog.map((log) => (
                <div key={log.id} className={`${securityStyles.logItem} ${securityStyles[log.type]}`}>
                  <div className={`${securityStyles.logIcon} ${securityStyles[log.type]}`}>
                    {log.icon}
                  </div>
                  <div className={securityStyles.logDetails}>
                    <div className={securityStyles.logAction}>
                      {log.action}
                    </div>
                    <div className={securityStyles.logInfo}>
                      {log.info} • {log.location}
                    </div>
                  </div>
                  <div className={securityStyles.logTime}>
                    {log.time}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 